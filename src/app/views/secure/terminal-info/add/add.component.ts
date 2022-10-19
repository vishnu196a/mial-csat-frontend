import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NameAndId } from '@secure/Database/cms.model';
import { ErrorResponse } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TerminalInfoForm } from '../terminal-info.model';
import { TerminalInfoService } from '../terminal-info.service';

@Component({
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit, OnDestroy {
  addInfoForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  terminals: NameAndId[] = [];
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService,
    private terminalInfoService: TerminalInfoService
  ) {}

  ngOnInit(): void {
    this.getTerminalNamesIds();
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.addInfoForm = this.formBuilder.group({
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
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.addInfoForm.controls;
  }

  onFormSubmit(): void {
    if (this.addInfoForm.valid) {
      this.isLoading = true;
      const terminalInfo: TerminalInfoForm = {
        category: this.addInfoForm.value.category,
        location: this.addInfoForm.value.location,
        shop_name: this.addInfoForm.value.shopName,
        email: this.addInfoForm.value.email,
        phone: this.addInfoForm.value.phone,
        terminal_id: this.addInfoForm.value.terminal,
        description: this.addInfoForm.value.description,
      };
      const observer = this.terminalInfoService.addTerminalInformation(terminalInfo).subscribe(
        () => {
          this.toasterService.success('Terminal information added successfully');
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
