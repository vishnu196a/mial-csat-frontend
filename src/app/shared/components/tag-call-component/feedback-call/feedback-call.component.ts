import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackForm } from '@secure/live-call/live-call.model';
import { LiveCallService } from '@secure/live-call/live-call.service';
import { ErrorResponse } from '@shared/models/shared.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './feedback-call.component.html',
})
export class FeedbackCallComponent implements OnInit, OnDestroy {
  tagFeedbackCallForm: FormGroup;
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
    this.tagFeedbackCallForm = this.formBuilder.group({
      responded: [null],
      mailTofeedback: [false],
      flightInfo: [null, [Validators.required]],
      dateOfJourney: [null, [Validators.required]],
      email: [null, [Validators.required]],
      callerName: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      feedback: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.tagFeedbackCallForm.controls;
  }

  onFormSubmit(): void {
    if (this.tagFeedbackCallForm.valid) {
      this.isLoading = true;
      const multipleEmail: string[] = this.tagFeedbackCallForm.value.email.split(';');
      const feedBackForm: FeedbackForm = {
        responded: this.tagFeedbackCallForm.value.responded,
        mail_to_feedback_team: this.tagFeedbackCallForm.value.mailTofeedback,
        subject: this.tagFeedbackCallForm.value.subject,
        feedback: this.tagFeedbackCallForm.value.feedback,
        email_id: multipleEmail,
        flight_info: this.tagFeedbackCallForm.value.flightInfo,
        caller_name: this.tagFeedbackCallForm.value.callerName,
        call_entry_id: this.callEntryId.toString(),
        date_of_journey: this.tagFeedbackCallForm.value.dateOfJourney,
      };
      const observer = this.liveCallService.feedBackCallTag(feedBackForm).subscribe(
        () => {
          this.toasterService.success('Feedback Email Sent Successfully');
          this.isLoading = false;
          this.modalRef.hide();
          localStorage.setItem('callType', '3');
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
