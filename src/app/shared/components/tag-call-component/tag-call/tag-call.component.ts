import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { CallTags, CallTagsList } from '@secure/call-tags/call-tags.model';
import { NameAndId } from '@secure/Database/cms.model';
import { CmsService } from '@secure/Database/cms.service';
import {
  LiveCallList,
  PreFillData,
  TagCall,
  TagCallState,
} from '@secure/live-call/live-call.model';
import { LiveCallService } from '@secure/live-call/live-call.service';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import {
  MODE_OF_CALL,
  PERMISSION_LIST,
  REGEX_PATTERNS,
  S_NO_WIDTH,
} from '@shared/constants/constants';
import { ErrorResponse, Pagination, Role } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { BusinessEnquiryComponent } from '../business-enquiry/business-enquiry.component';
import { EmergencyCallComponent } from '../emergency-call/emergency-call.component';
import { FeedbackCallComponent } from '../feedback-call/feedback-call.component';
import { RequestCallComponent } from '../request-call/request-call.component';
import { TagCallClearData, TagCallColumnSearch } from '../store/tag-call.actions';
import { GetTagCallState } from '../store/tag-call.selector';
import { TagCallColumnDef } from './tag-call.columns';

@Component({
  templateUrl: './tag-call.component.html',
})
export class TagCallComponent implements OnInit, OnDestroy {
  addCallTagForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  role: Role;
  categories: NameAndId[] = [];
  subCategories: NameAndId[] = [];
  terminals: NameAndId[] = [];
  showEmergencyContent: boolean = false;
  emergencyId: string;
  callId: number;
  columnDefs: ColDef[];
  CallTags: CallTags[] = [];
  page: number = 1;
  per_page: number = 10;
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  permissionList: typeof PERMISSION_LIST;
  defaultColumDefs: ColDef;
  showRed: boolean = false;
  callWaitingCount: number;
  callRefNo: string;
  callerNumber: string;
  callDuration: string;
  modalRef: BsModalRef;
  disableOption: boolean | null = null;
  callType: string;
  callFrom: string;
  subCategoryStoreValue: string | number;
  preFiledData: PreFillData;
  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private liveCallService: LiveCallService,
    private contentService: CmsService,
    private route: ActivatedRoute,
    private rolebasedPermissions: RolebasedPermissionService,
    public modalService: BsModalService,
    public location: Location,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.callId = this.route.snapshot.params.id;
    this.callType = localStorage.getItem('callType') || '1';
    this.callFrom = localStorage.getItem('CallFrom');
    if (this.callFrom === 'B') {
      this.getLiveCall();
    }
    this.disableOption = this.callType !== '1' ? true : null;
    this.getCategoriesNamesIds();
    this.initializeForm();
    this.modifyFormBasedOnRole();
    this.initializeColumn();

    this.permissionList = PERMISSION_LIST;
    const observer = this.modalService.onHide.subscribe((e) => {
      this.callType = localStorage.getItem('callType') || '1';
      this.disableOption = this.callType !== '1' ? true : null;
      this.addCallTagForm.patchValue({
        optionText: this.callType,
      });
    });
    this.subscriptions.add(observer);
  }

  initStoreValues(): void {
    const stateObserver = this.store
      .select(GetTagCallState)
      .pipe(take(1))
      .subscribe((state: TagCallState) => {
        this.addCallTagForm.patchValue({
          question: state.columns.question,
          category: state.columns.category || null,
          answer: state.columns.answer,
          terminal: state.columns.terminal || null,
          subCategory: state.columns.subCategory || null,
          name: state.columns.name ? state.columns.name : this.preFiledData.caller_name,
          email: state.columns.email,
        });
        this.subCategoryStoreValue = state.columns.subCategory || null;
        if (state.columns.category) {
          this.getSubCategoriesNamesIds(true);
        }
      });
    this.subscriptions.add(stateObserver);
  }
  initializeColumn(): void {
    this.columnDefs = [
      {
        headerName: 'S.No',
        width: S_NO_WIDTH,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
        floatingFilter: false,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(TagCallColumnDef);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No calls Tags to show.',
    };
  }
  private initializeForm(): void {
    this.addCallTagForm = this.formBuilder.group({
      question: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3000)]],
      category: [null, Validators.required],
      subCategory: [null, Validators.required],
      answer: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3000)]],
      terminal: [null],
      name: [null],
      email: [null, [Validators.pattern(REGEX_PATTERNS.email)]],
      optionText: [this.callType],
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
  }
  onPageChange(page: number): void {
    this.page = page;
    this.getCallTagHistory();
  }

  onPerPageChange(perPage: number): void {
    this.per_page = perPage;
    this.getCallTagHistory();
  }
  getPreFiledData(): void {
    const observer = this.liveCallService.getPreFillCallDetails(this.callId).subscribe(
      (response: PreFillData) => {
        this.preFiledData = response;
        this.getCallTagHistory();
        this.initStoreValues();
        this.callRefNo = response.call_reference_number;
        this.callerNumber = response.caller_id;
        this.callWaitingCount = response.total_call_waiting_count;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
  getLiveCall(): void {
    const observer = this.liveCallService.getLiveCallList().subscribe(
      (liveCalls: LiveCallList[]) => {
        if (liveCalls.length > 0) {
          this.callWaitingCount = liveCalls[0].total_call_waiting_count;
          this.showRed = parseInt(liveCalls[0].call_duration_in_minutes, 10) > 3;
          this.callerNumber = liveCalls[0].caller_id;
          this.callRefNo = liveCalls[0].call_reference_number;
        }
        setTimeout(() => this.getLiveCall(), 5000);
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }

  getCallTagHistory(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.liveCallService
      .getCallTags(this.per_page, this.page, this.preFiledData.caller_id)
      .subscribe(
        (response: CallTagsList) => {
          this.CallTags = response.call_tags;
          this.pagination = response.pagination;
          this.gridReadyEvent.api.hideOverlay();
        },
        (error: ErrorResponse) => {
          this.toasterService.error(error.message);
          this.gridReadyEvent.api.hideOverlay();
        }
      );
    this.subscriptions.add(observer);
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
  getSubCategoriesNamesIds(init?: boolean): void {
    this.addCallTagForm.controls.subCategory.reset();
    this.subCategories = [];
    const categoryId = this.addCallTagForm.value.category;
    if (categoryId) {
      const observer = this.contentService.getSubCategoriesNameId(categoryId).subscribe(
        (subCategories: NameAndId[]) => {
          this.subCategories = subCategories;
          if (init) {
            this.addCallTagForm.patchValue({
              subCategory: this.subCategoryStoreValue,
            });
          }
        },
        (error: ErrorResponse) => {
          this.toasterService.error(error.message);
          this.isLoading = false;
        }
      );
      this.subscriptions.add(observer);
    }
  }
  getTerminalNamesIds(): void {
    const observer = this.liveCallService.getTerminalNamesIds().subscribe(
      (terminals: NameAndId[]) => {
        this.terminals = terminals;
        this.getPreFiledData();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.addCallTagForm.controls;
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
    if (this.addCallTagForm.valid) {
      this.isLoading = true;
      const tagCall: TagCall = {
        answer: this.addCallTagForm.value.answer,
        question: this.addCallTagForm.value.question,
        category_id: this.addCallTagForm.value.category,
        call_entry_id: this.callId,
        sub_category_id: this.addCallTagForm.value.subCategory,
        caller_name: this.addCallTagForm.value.name,
        terminal_id: this.addCallTagForm.value.terminal ? this.addCallTagForm.value.terminal : null,
        contact_number: '',
        mode_of_call: MODE_OF_CALL[this.callType],
        caller_email_id: this.addCallTagForm.value.email,
      };
      const tagCallObsever =
        this.callFrom === 'B' || this.callFrom === 'C'
          ? this.liveCallService.tagCall(tagCall)
          : this.liveCallService.abandonedCallsTag(tagCall);
      const observer = tagCallObsever.subscribe(
        () => {
          this.toasterService.success('Call tagged successfully');
          localStorage.setItem('callType', '1');
          this.clearData();
          this.location.back();
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

  openModal(type: string): void {
    switch (type) {
      case 'emergency':
        this.modalRef = this.modalService.show(EmergencyCallComponent, {
          class: 'modal-lg',
          animated: true,
        });
        this.modalRef.content.callEntryId = this.callId;
        break;
      case 'business':
        this.modalRef = this.modalService.show(BusinessEnquiryComponent, {
          class: 'modal-lg',
          animated: true,
        });
        this.modalRef.content.callEntryId = this.callId;
        break;
      case 'feedback':
        this.modalRef = this.modalService.show(FeedbackCallComponent, {
          class: 'modal-lg',
          animated: true,
        });
        this.modalRef.content.callEntryId = this.callId;
        break;
      case 'request':
        this.modalRef = this.modalService.show(RequestCallComponent, {
          class: 'modal-xl',
          animated: true,
        });
        this.modalRef.content.callEntryId = this.callId;
        break;
    }
  }
  handleFilter(filterColumn: string, valueReceived: string): void {
    const value = valueReceived ? valueReceived : null;
    this.store.dispatch(new TagCallColumnSearch({ [filterColumn]: value }));
    if (filterColumn === 'category') {
      this.store.dispatch(new TagCallColumnSearch({ ['subCategory']: null }));
    }
  }
  clearData(): void {
    this.store.dispatch(new TagCallClearData());
    this.subCategories = [];
    this.initStoreValues();
  }
}
