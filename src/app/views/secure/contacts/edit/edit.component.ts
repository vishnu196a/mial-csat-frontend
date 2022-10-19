import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { REGEX_PATTERNS } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { FormStateService } from '@shared/services/form-state.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RolesList, ContactsForm, ContactsResponse, NameAndId } from '../contacts.model';
import { ContactsService } from '../contacts.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditContactComponent implements OnInit, OnDestroy {
  editContactsForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  EditContactComponent;
  hasContact: boolean;
  initialLoading = true;
  private contactId: number;
  private subscriptions = new Subscription();
  private currentContact: ContactsResponse;
  rolesList: RolesList[];
  categories: NameAndId[] = [];
  subCategories: NameAndId[] = [];
  terminals: NameAndId[] = [];
  phNoValidator: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService,
    private contactsService: ContactsService,
    private formState: FormStateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.contactId = this.route.snapshot.params.id;
    this.getTerminalNamesIds();
    this.getCategoriesNamesIds();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.editContactsForm = this.formBuilder.group({
      category: [null, [Validators.required]],
      subCategory: [null, [Validators.required]],
      terminal: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      mobile_no: [
        null,
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(REGEX_PATTERNS.mobile),
        ],
      ],
      landline: [null, [Validators.minLength(9), Validators.maxLength(14)]],
      email: [null, [Validators.required, Validators.pattern(REGEX_PATTERNS.email)]],
    });
  }
  getTerminalNamesIds(): void {
    const observer = this.contactsService.getTerminalNamesIds().subscribe(
      (terminals: NameAndId[]) => {
        this.terminals = terminals;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
  private getCategoriesNamesIds(): void {
    const observer = this.contactsService.getCategoriesNameId().subscribe(
      (categories: NameAndId[]) => {
        this.categories = categories;
        this.getContactsAndInitializeForm();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  getSubCategoriesNamesIds(patch?: boolean): void {
    this.editContactsForm.controls.subCategory.reset();
    const categoryId = this.editContactsForm.value.category;
    const observer = this.contactsService.getSubCategoriesNameId(categoryId).subscribe(
      (subCategories: NameAndId[]) => {
        this.subCategories = subCategories;
        if (patch) {
          this.editContactsForm.patchValue({
            subCategory: this.currentContact.sub_category_id.toString(),
          });
        }
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  private getContactsAndInitializeForm(): void {
    const observer = this.contactsService.getContactsDetails(this.contactId).subscribe(
      (contacts: ContactsResponse) => {
        this.editContactsForm.patchValue({
          category: contacts.category_id.toString(),
          name: contacts.name,
          mobile_no: contacts.phone,
          email: contacts.email,
          terminal: contacts.terminal_id.toString(),
          landline: contacts.landline_number,
        });
        this.getSubCategoriesNamesIds(true);
        this.currentContact = contacts;
        this.hasContact = true;
        this.initialLoading = false;
        this.formState.isFormPristine(this.editContactsForm);
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.hasContact = false;
        this.initialLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.editContactsForm.controls;
  }

  onFormUpdate(): void {
    if (this.editContactsForm.valid) {
      this.isLoading = true;
      const contacts: ContactsForm = {
        category_id: this.editContactsForm.value.category,
        sub_category_id: this.editContactsForm.value.subCategory,
        name: this.editContactsForm.value.name,
        phone: this.editContactsForm.value.mobile_no,
        email: this.editContactsForm.value.email,
        terminal_id: this.editContactsForm.value.terminal,
        landline_number: this.editContactsForm.value.landline,
      };
      const observer = this.contactsService.updateContacts(contacts, this.contactId).subscribe(
        () => {
          this.toasterService.success('Contact has been updated successfully');
          this.router.navigate(['contacts']);
        },
        (error: ErrorResponse) => {
          if (error.hasValidationError) {
            this.hasValidationError = true;
            this.validationErrors = error.errorList;
          } else {
            this.hasValidationError = false;
            window.scrollTo({ top: 0 });
            this.toasterService.error(error.message);
          }
          this.isLoading = false;
        }
      );
      this.subscriptions.add(observer);
    }
  }
  handlePhNoValidation(): void {
    if (
      !(this.formControls.mobile_no.touched && this.formControls.mobile_no.invalid) &&
      !(this.formControls.landline.touched && this.formControls.landline.invalid)
    ) {
      this.phNoValidator =
        this.editContactsForm.value.mobile_no || this.editContactsForm.value.landline
          ? false
          : true;
    }
  }
}
