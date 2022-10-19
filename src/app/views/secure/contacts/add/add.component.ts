import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REGEX_PATTERNS, USER_ROLES } from '@shared/constants/constants';
import { ErrorResponse, Role } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ContactsForm, NameAndId, RolesList } from '../contacts.model';
import { ContactsService } from '../contacts.service';

@Component({
  templateUrl: './add.component.html',
})
export class AddContactsComponent implements OnInit, OnDestroy {
  addContactsForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  categories: NameAndId[] = [];
  terminals: NameAndId[] = [];
  phNoValidator: boolean = false;
  subCategories: NameAndId[] = [];
  role: Role;
  rolesList: RolesList[];
  readonly roles = USER_ROLES;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService,
    private contactsService: ContactsService
  ) {}

  ngOnInit(): void {
    this.getCategoriesNamesIds();
    this.getTerminalNamesIds();
    this.initializeForm();
    this.modifyFormBasedOnRole();
    this.getRolesList();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getCategoriesNamesIds(): void {
    const observer = this.contactsService.getCategoriesNameId().subscribe(
      (categories: NameAndId[]) => {
        this.categories = categories;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
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
  getSubCategoriesNamesIds(): void {
    this.addContactsForm.controls.subCategory.reset();
    const categoryId = this.addContactsForm.value.category;
    const observer = this.contactsService.getSubCategoriesNameId(categoryId).subscribe(
      (subCategories: NameAndId[]) => {
        this.subCategories = subCategories;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
  initializeForm(): void {
    this.addContactsForm = this.formBuilder.group({
      category: [null, [Validators.required]],
      subCategory: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      mobile_no: [
        null,
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(REGEX_PATTERNS.mobile),
        ],
      ],
      landline: [null, [Validators.minLength(9), Validators.maxLength(12)]],
      email: [null, [Validators.required, Validators.pattern(REGEX_PATTERNS.email)]],
      terminal: [null, [Validators.required]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.addContactsForm.controls;
  }

  private getRolesList(): void {
    this.isLoading = true;
    const observer = this.contactsService.getRoles().subscribe(
      (roles: RolesList[]) => {
        this.rolesList = roles;
        this.isLoading = false;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
  private modifyFormBasedOnRole(): void {
    if (this.role) {
      const roleFromControl = this.formControls.role;
      roleFromControl.setValue(this.role);
      roleFromControl.disable();
      roleFromControl.updateValueAndValidity();
    }
  }

  onFormSubmit(): void {
    if (this.addContactsForm.valid) {
      this.isLoading = true;
      const contacts: ContactsForm = {
        category_id: this.addContactsForm.value.category,
        sub_category_id: this.addContactsForm.value.subCategory,
        name: this.addContactsForm.value.name,
        phone: this.addContactsForm.value.mobile_no,
        email: this.addContactsForm.value.email,
        terminal_id: this.addContactsForm.value.terminal,
        landline_number: this.addContactsForm.value.landline,
      };
      const observer = this.contactsService.addContact(contacts).subscribe(
        () => {
          this.toasterService.success('Contact added successfully');
          this.router.navigate(['contacts']);
        },
        (error: ErrorResponse) => {
          if (error.hasValidationError) {
            this.hasValidationError = true;
            this.validationErrors = error.errorList;
            window.scrollTo({ top: 0 });
          } else {
            this.hasValidationError = false;
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
        this.addContactsForm.value.mobile_no || this.addContactsForm.value.landline ? false : true;
    }
  }
}
