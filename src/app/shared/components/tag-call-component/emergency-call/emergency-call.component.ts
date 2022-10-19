import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmergencyForm } from '@secure/live-call/live-call.model';
import { LiveCallService } from '@secure/live-call/live-call.service';
import { ErrorResponse } from '@shared/models/shared.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './emergency-call.component.html',
})
export class EmergencyCallComponent implements OnInit, OnDestroy {
  tagEmergencyCallForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  private subscriptions = new Subscription();
  public callEntryId: number;

  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private liveCallService: LiveCallService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.tagEmergencyCallForm = this.formBuilder.group({
      subject: [null, [Validators.required]],
      phoneNo: [null],
      email: [null, [Validators.required]],
      comments: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      department: [null],
      contactPerson: [null, [Validators.required]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.tagEmergencyCallForm.controls;
  }

  onFormSubmit(): void {
    if (this.tagEmergencyCallForm.valid) {
      this.isLoading = true;
      const multipleEmail: string[] = this.tagEmergencyCallForm.value.email.split(';');
      const emergencyForm: EmergencyForm = {
        subject: this.tagEmergencyCallForm.value.subject,
        phone_no: this.tagEmergencyCallForm.value.phoneNo,
        email_id: multipleEmail,
        comments: this.tagEmergencyCallForm.value.comments,
        department: this.tagEmergencyCallForm.value.department,
        call_entry_id: this.callEntryId,
        contact_person: this.tagEmergencyCallForm.value.contactPerson,
      };
      const observer = this.liveCallService.emergencyCallTag(emergencyForm).subscribe(
        () => {
          this.toasterService.success('Emergency email sent successfully');
          this.isLoading = false;
          this.modalRef.hide();
          localStorage.setItem('callType', '4');
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
