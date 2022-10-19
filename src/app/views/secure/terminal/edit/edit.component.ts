import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResponse } from '@shared/models/shared.model';
import { FormStateService } from '@shared/services/form-state.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Terminal } from '../terminal.model';
import { TerminalService } from '../terminal.service';

@Component({
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit, OnDestroy {
  editTerminalForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  hasTerminal: boolean;
  initialLoading = true;
  private terminalId: number;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService,
    private terminalService: TerminalService,
    private formState: FormStateService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.terminalId = this.route.snapshot.params.id;
    this.getTerminalAndInitializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.editTerminalForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    });
  }

  private getTerminalAndInitializeForm(): void {
    const observer = this.terminalService.getTerminalDetails(this.terminalId).subscribe(
      (terminal: Terminal) => {
        this.editTerminalForm.patchValue({
          name: terminal.name,
        });
        this.hasTerminal = true;
        this.initialLoading = false;
        this.formState.isFormPristine(this.editTerminalForm);
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.hasTerminal = false;
        this.initialLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.editTerminalForm.controls;
  }

  onFormUpdate(): void {
    if (this.editTerminalForm.valid) {
      this.isLoading = true;
      const terminal: Terminal = {
        name: this.editTerminalForm.value.name,
      };
      const observer = this.terminalService.updateTerminal(terminal, this.terminalId).subscribe(
        () => {
          this.toasterService.success('Terminal location has been updated successfully');
          this.router.navigate(['terminals']);
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
}
