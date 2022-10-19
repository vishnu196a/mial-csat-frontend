import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdAndDesc, NameAndId } from '@secure/Database/cms.model';
import { CmsService } from '@secure/Database/cms.service';
import { BusinessEnquiryComponent } from '@shared/components/tag-call-component/business-enquiry/business-enquiry.component';
import { EmergencyCallComponent } from '@shared/components/tag-call-component/emergency-call/emergency-call.component';
import { FeedbackCallComponent } from '@shared/components/tag-call-component/feedback-call/feedback-call.component';
import { RequestCallComponent } from '@shared/components/tag-call-component/request-call/request-call.component';
import { MODE_OF_CALL, REGEX_PATTERNS } from '@shared/constants/constants';
import { ErrorResponse, IdValue, Role } from '@shared/models/shared.model';
import { SharedService } from '@shared/services/shared.service';
import { forEach } from 'lodash';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ManualCallResponse, ManualCallTag } from '../live-call.model';
import { LiveCallService } from '../live-call.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  templateUrl: './add.component.html',
})
export class AddManualCallTagComponent implements OnInit, OnDestroy {
  addManualCallTagForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  role: Role;
  modeOfCall: IdValue[] = [];
  categories: NameAndId[] = [];
  terminals: NameAndId[] = [];
  subCategories: NameAndId[] = [];
  languages: IdAndDesc[] = [];
  initDateValidator: boolean = false;
  endDateValidator: boolean = false;
  modalRef: BsModalRef;
  private subscriptions = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService,
    private liveCallService: LiveCallService,
    private contentService: CmsService,
    private shared: SharedService,
    public modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.modifyFormBasedOnRole();
    forEach(MODE_OF_CALL, (key, val) => {
      const obj = { id: key, value: val };
      this.modeOfCall.push(obj);
    });
    this.getCategoriesNamesIds();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.addManualCallTagForm = this.formBuilder.group({
      callerid: [null, [Validators.required]],
      id_queue_call_entry: [null, [Validators.required]],
      caller_name: [null],
      category_id: [null, [Validators.required]],
      sub_category_id: [null, [Validators.required]],
      terminal_id: [null],
      caller_email_id: [null, [Validators.pattern(REGEX_PATTERNS.email)]],
      mode_of_call: [null, [Validators.required]],
      question: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]],
      answer: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(1000)]],
      datetime_end: [null, [Validators.required]],
      datetime_init: [null, [Validators.required]],
      datetime_entry_queue: [null, [Validators.required]],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.addManualCallTagForm.controls;
  }

  private modifyFormBasedOnRole(): void {
    if (this.role) {
      const roleFromControl = this.formControls.role;
      roleFromControl.setValue(this.role);
      roleFromControl.disable();
      roleFromControl.updateValueAndValidity();
    }
  }
  private getCategoriesNamesIds(): void {
    const observer = this.contentService.getCategoriesNameId().subscribe(
      (categories: NameAndId[]) => {
        this.categories = categories;
        this.getTerminalNamesIds();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
  getTerminalNamesIds(): void {
    const observer = this.liveCallService.getTerminalNamesIds().subscribe(
      (terminals: NameAndId[]) => {
        this.terminals = terminals;
        this.getLanguages();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
  getLanguages(): void {
    const observer = this.liveCallService.getLanguageNamesIds().subscribe(
      (languages: IdAndDesc[]) => {
        this.languages = languages;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
  getSubCategoriesNamesIds(): void {
    this.addManualCallTagForm.controls.sub_category_id.reset();
    this.subCategories = [];
    const categoryId = this.addManualCallTagForm.value.category_id;
    if (categoryId) {
      const observer = this.contentService.getSubCategoriesNameId(categoryId).subscribe(
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
  }
  onFormSubmit(): void {
    if (this.addManualCallTagForm.valid) {
      this.isLoading = true;
      const manualCallTagForm: ManualCallTag = this.addManualCallTagForm.value;
      manualCallTagForm.datetime_end = this.shared.getReportFilterDate(
        manualCallTagForm.datetime_end
      );
      manualCallTagForm.datetime_init = this.shared.getReportFilterDate(
        manualCallTagForm.datetime_init
      );
      manualCallTagForm.datetime_entry_queue = this.shared.getReportFilterDate(
        manualCallTagForm.datetime_entry_queue
      );

      const observer = this.liveCallService.manualCallTag(manualCallTagForm).subscribe(
        (response: ManualCallResponse) => {
          this.toasterService.success('Manual call tagged successfully');
          this.openModal(response.mode, response.id);
          this.isLoading = false;
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
  handleDate(): void {
    this.initDateValidator =
      moment(this.addManualCallTagForm.value.datetime_entry_queue) >
      moment(this.addManualCallTagForm.value.datetime_init);
    this.endDateValidator =
      moment(this.addManualCallTagForm.value.datetime_init) >
      moment(this.addManualCallTagForm.value.datetime_end);
  }

  openModal(type: string, callId: number): void {
    switch (type) {
      case 'Emergency':
        this.modalRef = this.modalService.show(EmergencyCallComponent, {
          class: 'modal-lg',
          animated: true,
        });
        this.modalRef.content.callEntryId = callId;
        break;
      case 'Business Enquiry':
        this.modalRef = this.modalService.show(BusinessEnquiryComponent, {
          class: 'modal-lg',
          animated: true,
        });
        this.modalRef.content.callEntryId = callId;
        break;
      case 'Feedback':
        this.modalRef = this.modalService.show(FeedbackCallComponent, {
          class: 'modal-lg',
          animated: true,
        });
        this.modalRef.content.callEntryId = callId;
        break;
      case 'Request':
        this.modalRef = this.modalService.show(RequestCallComponent, {
          class: 'modal-xl',
          animated: true,
        });
        this.modalRef.content.callEntryId = callId;
        break;
      default:
        localStorage.setItem('callType', '1');
        this.router.navigate(['/live_call']);
    }
    this.modalService.onHide.subscribe(() => {
      localStorage.setItem('callType', '1');
      this.router.navigate(['/live_call']);
    });
  }
}
