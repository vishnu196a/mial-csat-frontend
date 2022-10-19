import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NameAndId } from '@secure/Database/cms.model';
import { CmsService } from '@secure/Database/cms.service';
import { UserService } from '@secure/user/user.service';
import { CALL_STATUS, DYNAMIC_COLUMNS, MODE_OF_CALL } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { forEach } from 'lodash';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  Columns,
  DynamicReportForm,
  Filters,
  FilterValues,
  ReportColumns,
  TemplateList,
} from '../report-manager.model';
import { ReportManagerService } from '../report-manager.service';
import { TemplateListComponent } from './template-list/template-list.component';

@Component({
  selector: 'app-dynamic-reports',
  templateUrl: './dynamic-reports.component.html',
})
export class DynamicReportsComponent implements OnInit, OnDestroy {
  columns: NameAndId[];
  columnReceived: Columns;
  reportName: string;
  dynamicReportForm: FormGroup;
  isLoading: boolean;
  hasValidationError: boolean;
  validationErrors: string[];
  private subscriptions = new Subscription();
  agents: NameAndId[] = [];
  callStatus: NameAndId[] = [];
  modeOfCall: string[] = [];
  categories: NameAndId[] = [];
  subCategories: NameAndId[] = [];
  filters: Filters;
  toDateValidator: boolean = false;
  modalRef: BsModalRef;
  maxDate = moment().format('YYYY-MM-DD HH:mm');
  templateList: TemplateList[] = [];
  showFilter = false;
  dropdownSettings: any = {};
  constructor(
    private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    private reportService: ReportManagerService,
    private contentService: CmsService,
    private userService: UserService,
    public modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getReportColumns();
    this.initializeForm();
    this.getCategoriesNamesIds();
    this.loadUsers();
    forEach(MODE_OF_CALL, (value) => {
      this.modeOfCall.push(value);
    });
    forEach(CALL_STATUS, (value, key) => {
      const status = { id: key, name: value };
      this.callStatus.push(status);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initializeForm(): void {
    this.dynamicReportForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      status: [null],
      fromDate: [null],
      toDate: [null],
      category: [null],
      subCategory: [null],
      agent: [null],
      callSource: [null],
      columns: [null, [Validators.required]],
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'select All',
      unSelectAllText: 'Unselect All',
      itemsShowLimit: 100,
      allowSearchFilter: this.showFilter,
    };
  }
  loadUsers(): void {
    const observer = this.userService.getUsersNameId().subscribe(
      (users: NameAndId[]) => {
        this.agents = users;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  getReportColumns(): void {
    const observer = this.reportService.getReportColumns().subscribe(
      (columns: ReportColumns) => {
        this.filters = columns.filters;
        this.columnReceived = columns.columns;
        const columnArray: NameAndId[] = [];
        forEach(columns.columns, (value, key) => {
          const data = { id: value, name: key };
          columnArray.push(data);
        });
        this.columns = columnArray;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.dynamicReportForm.controls;
  }

  private getCategoriesNamesIds(): void {
    const observer = this.contentService.getCategoriesNameId().subscribe(
      (categories: NameAndId[]) => {
        this.categories = categories;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.isLoading = false;
      }
    );
    this.subscriptions.add(observer);
  }
  getSubCategoriesNamesIds(): void {
    this.dynamicReportForm.controls.subCategory.reset();
    this.subCategories = [];
    const categoryId = this.dynamicReportForm.value.category;
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
    if (this.dynamicReportForm.valid) {
      this.isLoading = true;
      const dynamicReport: DynamicReportForm = {
        name: this.dynamicReportForm.value.name,
        payload: {
          columns: {},
          filters: {},
        },
      };
      const columns = [...this.dynamicReportForm.value.columns];
      columns.forEach((column) => {
        dynamicReport.payload.columns[column.name] = DYNAMIC_COLUMNS[column.name];
      });
      const format = 'YYYY-MM-DD HH:mm';
      const filters: FilterValues = {
        created_by: this.dynamicReportForm.value.agent,
        category_id: this.dynamicReportForm.value.category,
        type: this.dynamicReportForm.value.callSource,
        sub_category_id: this.dynamicReportForm.value.subCategory,
        status: this.dynamicReportForm.value.status,
        from: this.dynamicReportForm.value.fromDate
          ? moment.utc(this.dynamicReportForm.value.fromDate).format(format)
          : '',
        to: this.dynamicReportForm.value.toDate
          ? moment.utc(this.dynamicReportForm.value.toDate).format(format)
          : '',
      };
      forEach(filters, (value, key) => {
        if (value) {
          dynamicReport.payload.filters[key] = value;
        }
      });
      const observer = this.reportService.downloadReport(dynamicReport).subscribe(
        () => {
          this.toasterService.success('Download request successfully sent');
          this.isLoading = false;
          this.dynamicReportForm.reset();
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
  handleFilter(): void {
    this.toDateValidator =
      moment(this.dynamicReportForm.value.fromDate) > moment(this.dynamicReportForm.value.toDate);
  }

  onSaveAsTemplate(): void {
    if (this.dynamicReportForm.valid) {
      const selected = {};
      const selectedColumns = this.dynamicReportForm.value.columns;
      if (selectedColumns) {
        forEach(this.columnReceived, (value, key) => {
          forEach(selectedColumns, (value2) => {
            if (value2.name === key) {
              selected[key] = value;
            }
          });
        });
      }
      this.isLoading = true;
      const dynamicReport: DynamicReportForm = {
        name: this.dynamicReportForm.value.name,
        payload: {
          columns: selected,
          filters: {},
        },
      };

      const observer = this.reportService.saveAsTemplate(dynamicReport).subscribe(
        () => {
          this.toasterService.success('Template saved successfully');
          this.isLoading = false;
          this.dynamicReportForm.reset();
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

  openModal(): void {
    this.modalRef = this.modalService.show(TemplateListComponent, {
      class: 'modal-lg',
      animated: true,
    });
    const observer = this.modalRef.content.select.subscribe((data: TemplateList) => {
      this.modalRef.hide();
      const col = [];
      forEach(data.payload.columns, (value, key) => {
        const obj = { id: value, name: key };
        col.push(obj);
      });
      const columnArray: NameAndId[] = [];
      forEach(this.columnReceived, (value, key) => {
        const column = { id: value, name: key };
        columnArray.push(column);
      });
      this.columns = columnArray;
      this.dynamicReportForm.patchValue({
        name: data.name,
        columns: col,
      });
    });
    this.subscriptions.add(observer);
  }
}
