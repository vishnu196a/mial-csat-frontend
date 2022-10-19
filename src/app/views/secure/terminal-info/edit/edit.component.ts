import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NameAndId } from '@secure/Database/cms.model';
import { ErrorResponse } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TerminalInfo, TerminalInfoForm } from '../terminal-info.model';
import { TerminalInfoService } from '../terminal-info.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit, OnDestroy {
  editInfoForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  terminals: NameAndId[] = [];
  phNoValidator: boolean = false;
  private subscriptions = new Subscription();
  tInfoId: string;
  hasInfo: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService,
    private terminalInfoService: TerminalInfoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tInfoId = this.route.snapshot.params.id;
    this.getTerminalNamesIds();
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.editInfoForm = this.formBuilder.group({
      terminal: [null, [Validators.required]],
      location: [null, [Validators.required]],
      category: [null, [Validators.required]],
      shopName: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [null],
      phone: [null],
      email: [null],
    });
  }

  getTerminalNamesIds(): void {
    const observer = this.terminalInfoService.getTerminalNamesIds().subscribe(
      (terminals: NameAndId[]) => {
        this.terminals = terminals;
        this.getTerminalInformations();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.editInfoForm.controls;
  }

  getTerminalInformations(): void {
    const observer = this.terminalInfoService.getTerminalInformation(this.tInfoId).subscribe(
      (tInfo: TerminalInfo) => {
        this.editInfoForm.patchValue({
          category: tInfo.category,
          shopName: tInfo.shop_name,
          phone: tInfo.phone,
          email: tInfo.email,
          terminal: tInfo.terminal_id.toString(),
          description: tInfo.description,
          location: tInfo.location,
        });
        this.hasInfo = true;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.hasInfo = false;
      }
    );
    this.subscriptions.add(observer);
  }

  onFormSubmit(): void {
    if (this.editInfoForm.valid) {
      this.isLoading = true;
      const terminalInfo: TerminalInfoForm = {
        category: this.editInfoForm.value.category,
        location: this.editInfoForm.value.location,
        shop_name: this.editInfoForm.value.shopName,
        email: this.editInfoForm.value.email,
        phone: this.editInfoForm.value.phone,
        terminal_id: this.editInfoForm.value.terminal,
        description: this.editInfoForm.value.description,
      };
      const observer = this.terminalInfoService
        .updateTerminalInformation(terminalInfo, this.tInfoId)
        .subscribe(
          () => {
            this.toasterService.success('Terminal information updated successfully');
            this.router.navigate(['terminal_info']);
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
}
