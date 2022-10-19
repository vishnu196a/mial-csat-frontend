import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorResponse, Role } from '@shared/models/shared.model';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Terminal } from '../terminal.model';
import { TerminalService } from '../terminal.service';

@Component({
  templateUrl: './add.component.html',
})
export class AddComponent implements OnInit, OnDestroy {
  addTerminalForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  role: Role;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService,
    private terminalService: TerminalService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.modifyFormBasedOnRole();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.addTerminalForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.addTerminalForm.controls;
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
    if (this.addTerminalForm.valid) {
      this.isLoading = true;
      const terminal: Terminal = {
        name: this.addTerminalForm.value.name,
      };
      const observer = this.terminalService.addTerminal(terminal).subscribe(
        () => {
          this.toasterService.success('Terminal location added successfully');
          this.router.navigate(['terminals']);
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
