import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NameAndId } from '@secure/Database/cms.model';
import { DownloadStatic, ManageReport } from '@secure/reports/report-manager.model';
import { ReportManagerService } from '@secure/reports/report-manager.service';
import { UserService } from '@secure/user/user.service';
import { CALL_TYPES, MODE_OF_CALL } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { SharedService } from '@shared/services/shared.service';
import { forEach } from 'lodash';
import moment from 'moment';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-component',
  templateUrl: './filter-component.component.html',
})
export class FilterComponentComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  private subscriptions = new Subscription();
  public params: ManageReport;
  agents: NameAndId[] = [];
  callType: string[] = [];
  modeOfCall: string[] = [];
  toDateValidator: boolean = false;
  maxDate = moment().format('YYYY-MM-DD HH:mm');

  constructor(
    public modalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private reportService: ReportManagerService,
    private toasterService: ToastrService,
    private shared: SharedService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.initializeForm();
    forEach(MODE_OF_CALL, (value) => {
      this.modeOfCall.push(value);
    });
    forEach(CALL_TYPES, (value) => {
      this.callType.push(value);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.filterForm = this.formBuilder.group({
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      callType: [null],
      agent: [null],
      callSource: [null],
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.filterForm.controls;
  }

  onFormSubmit(): void {
    const filters: DownloadStatic = {
      filters: {
        from: this.shared.getReportFilterDate(this.filterForm.value.fromDate),
        to: this.shared.getReportFilterDate(this.filterForm.value.toDate),
      },
    };
    if (this.params.filters['Agent']) {
      filters.filters.agent = this.filterForm.value.agent;
    }
    if (this.params.filters['Mode of call']) {
      filters.filters.mode_of_call = this.filterForm.value.callSource;
    }
    if (this.params.filters['call type']) {
      filters.filters.call_type = this.filterForm.value.callType;
    }
    if (this.filterForm.valid) {
      this.isLoading = true;
      const observer = this.reportService
        .downloadStaticReport(this.params.id.toString(), filters)
        .subscribe(
          () => {
            this.toasterService.success('Download request sent successfully');
            this.isLoading = false;
            this.modalRef.hide();
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
  loadUsers(): void {
    const observer = this.userService.getUsersNameId().subscribe(
      (users: NameAndId[]) => {
        this.agents = users;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
      }
    );
    this.subscriptions.add(observer);
  }
  handleFilter(): void {
    this.toDateValidator =
      moment(this.filterForm.value.fromDate) > moment(this.filterForm.value.toDate);
  }
}
