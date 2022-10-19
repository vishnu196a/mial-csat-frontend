import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorResponse } from '@shared/models/shared.model';
import { FormStateService } from '@shared/services/form-state.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CmsService } from '@secure/Database/cms.service';
import { Sos, SosForm } from '@secure/Database/cms.model';

@Component({
  templateUrl: './edit.component.html',
})
export class EditSosComponent implements OnInit, OnDestroy {
  editSosForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  hasTerminal: boolean;
  initialLoading = true;
  private sosId: number;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService,
    private formState: FormStateService,
    private cmsService: CmsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.sosId = this.route.snapshot.params.id;
    this.getTerminalAndInitializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): void {
    this.editSosForm = this.formBuilder.group({
      helpDeskType: [null, [Validators.required]],
      extension: [null, [Validators.required]],
    });
  }

  private getTerminalAndInitializeForm(): void {
    const observer = this.cmsService.getSosDetails(this.sosId).subscribe(
      (sosDetails: Sos) => {
        this.editSosForm.patchValue({
          helpDeskType: sosDetails.type,
          extension: sosDetails.extension,
        });
        this.hasTerminal = true;
        this.initialLoading = false;
        this.formState.isFormPristine(this.editSosForm);
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
    return this.editSosForm.controls;
  }

  onFormUpdate(): void {
    if (this.editSosForm.valid) {
      this.isLoading = true;
      const sos: SosForm = {
        type: this.editSosForm.value.helpDeskType,
        extension: this.editSosForm.value.extension,
      };
      const observer = this.cmsService.updateSos(sos, this.sosId).subscribe(
        () => {
          this.toasterService.success('SOS Helpline Details has been updated successfully');
          this.router.navigate(['/database/helpSOS']);
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
