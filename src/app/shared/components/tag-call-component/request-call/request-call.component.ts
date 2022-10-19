import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestCallForm } from '@secure/live-call/live-call.model';
import { LiveCallService } from '@secure/live-call/live-call.service';
import { REGEX_PATTERNS } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './request-call.component.html',
})
export class RequestCallComponent implements OnInit, OnDestroy {
  tagRequestCallForm: FormGroup;
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
    this.tagRequestCallForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      firstName: [null, [Validators.required]],
      meetAndAssist: [null, [Validators.required]],
      contactEmail: [null, [Validators.required]],
      mobileNo: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern(REGEX_PATTERNS.mobile),
        ],
      ],
      email: [null],
      city: [null],
      country: [null],
      address: [null],
      telephone: [null],
      lastName: [null],
      postalCode: [null],
      nationality: [null],
      dateOfBirth: [null],
      placeOfMake: [null],
      dateOfIssue: [null],
      passportNumber: [null],
      portOfDestination: [null],
      mailToFeedbackTeam: [false],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.tagRequestCallForm.controls;
  }

  onFormSubmit(): void {
    if (this.tagRequestCallForm.valid) {
      this.isLoading = true;
      const multipleEmail: string[] = this.tagRequestCallForm.value.contactEmail.split(';');
      const requestForm: RequestCallForm = {
        subject: this.tagRequestCallForm.value.subject,
        email: this.tagRequestCallForm.value.email,
        city: this.tagRequestCallForm.value.city,
        title: this.tagRequestCallForm.value.title,
        address: this.tagRequestCallForm.value.address,
        telephone: this.tagRequestCallForm.value.telephone,
        mobile_no: this.tagRequestCallForm.value.mobileNo,
        last_name: this.tagRequestCallForm.value.lastName,
        first_name: this.tagRequestCallForm.value.firstName,
        postal_code: this.tagRequestCallForm.value.postalCode,
        nationality: this.tagRequestCallForm.value.nationality,
        call_entry_id: this.callEntryId,
        date_of_birth: this.tagRequestCallForm.value.dateOfBirth,
        place_of_make: this.tagRequestCallForm.value.placeOfMake,
        date_of_issue: this.tagRequestCallForm.value.dateOfIssue,
        meet_and_assist: this.tagRequestCallForm.value.meetAndAssist,
        passport_number: this.tagRequestCallForm.value.passportNumber,
        port_of_destination: this.tagRequestCallForm.value.portOfDestination,
        mail_to_feedback_team: this.tagRequestCallForm.value.mailToFeedbackTeam,
        contact_person_email_id: multipleEmail,
      };
      const observer = this.liveCallService.requestCallTag(requestForm).subscribe(
        () => {
          this.toasterService.success('Email sent successfully');
          this.isLoading = false;
          this.modalRef.hide();
          localStorage.setItem('callType', '2');
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
