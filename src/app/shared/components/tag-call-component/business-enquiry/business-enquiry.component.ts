import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessForm } from '@secure/live-call/live-call.model';
import { LiveCallService } from '@secure/live-call/live-call.service';
import { REGEX_PATTERNS } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './business-enquiry.component.html',
})
export class BusinessEnquiryComponent implements OnInit, OnDestroy {
  tagBusinessCallForm: FormGroup;
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
    this.tagBusinessCallForm = this.formBuilder.group({
      name: [null],
      phoneNo: [null],
      email: [null, [Validators.required]],
      comments: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
      date: [moment(new Date()).format('YYYY-MM-DD')],
      customerMail: [null, [Validators.pattern(REGEX_PATTERNS.email)]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.tagBusinessCallForm.controls;
  }

  onFormSubmit(): void {
    if (this.tagBusinessCallForm.valid) {
      this.isLoading = true;
      const multipleEmail: string[] = this.tagBusinessCallForm.value.email.split(';');
      const businessForm: BusinessForm = {
        phone_no: this.tagBusinessCallForm.value.phoneNo,
        email_id: multipleEmail,
        comments: this.tagBusinessCallForm.value.comments,
        call_entry_id: this.callEntryId.toString(),
        name: this.tagBusinessCallForm.value.name,
        date: this.tagBusinessCallForm.value.date,
        customer_email_id: this.tagBusinessCallForm.value.customerMail,
      };
      const observer = this.liveCallService.businessCallTag(businessForm).subscribe(
        () => {
          this.toasterService.success('Business enquiry email sent successfully');
          this.isLoading = false;
          this.modalRef.hide();
          localStorage.setItem('callType', '5');
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
