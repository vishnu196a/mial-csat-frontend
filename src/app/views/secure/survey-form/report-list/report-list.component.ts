import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import {
  DeleteModelContent,
  ErrorResponse,
  FloatingFilterSearchData,
  Pagination,
} from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SurveyReport, SurveyReportList } from '../survey-list.model';
import { SurveyListService } from '../survey-list.service';
import { reportsColumnDef } from './report-list.columns';

@Component({
  templateUrl: './report-list.component.html',
})
export class ReportListComponent implements OnInit {
  private formId: number;
  subscriptions = new Subscription();
  surveyReportList: SurveyReport[] = [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  searchValue: string;
  deleteModelContent: DeleteModelContent;
  permissionList: typeof PERMISSION_LIST;
  pagination: Pagination;
  page: number = 1;
  perPage: number = 10;
  searchData = {};
  defaultColumDefs: ColDef;

  constructor(
    private route: ActivatedRoute,
    private surveyListService: SurveyListService,
    private toasterService: ToastrService,
    private rolebasedPermissions: RolebasedPermissionService
  ) {}

  ngOnInit(): void {
    this.formId = this.route.snapshot.params.id;
    this.columnDefs = [
      {
        headerName: 'S.No',
        maxWidth: S_NO_WIDTH,
        floatingFilter: false,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(reportsColumnDef);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No reports to show.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }
  onPageChange(page: number): void {
    this.page = page;
    this.getSurveyReportList();
  }

  onPerPageChange(perPage: number): void {
    this.perPage = perPage;
    this.getSurveyReportList();
  }
  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.searchData = searchData;
    this.onPageChange(1);
  }
  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.getSurveyReportList();
  }
  getSurveyReportList(): void {
    this.gridReadyEvent.api.showLoadingOverlay();

    const observer = this.surveyListService
      .surveyReportList(this.formId, this.page, this.perPage, this.searchData)
      .subscribe(
        (reportList: SurveyReportList) => {
          this.surveyReportList = reportList.survey_form_reports;
          this.pagination = reportList.pagination;
          this.gridReadyEvent.api.refreshCells();
          this.gridReadyEvent.api.hideOverlay();
        },
        (error: ErrorResponse) => {
          this.toasterService.error(error.message);
          this.gridReadyEvent.api.hideOverlay();
        }
      );
    this.subscriptions.add(observer);
  }
}
