import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST } from '@shared/constants/constants';
import { ErrorResponse, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { SharedService } from '@shared/services/shared.service';
import { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { Reports, ReportsList } from '../report-manager.model';
import { ReportManagerService } from '../report-manager.service';
import {
  SetReportsCurrentPage,
  UpdateReportsGlobalSearch,
  UpdateReportsPerPage,
} from '../store/reports.actions';
import { GetReportsGlobalSearch } from '../store/reports.selector';
import { ReportsColumnDefs } from './reports.columns';

@Component({
  selector: 'app-report-records',
  templateUrl: './report-records.component.html',
})
export class ReportRecordsComponent implements OnInit, OnDestroy {
  reports: Reports[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  permissionList: typeof PERMISSION_LIST;
  defaultColumDefs: ColDef;

  constructor(
    private store: Store<AppState>,
    private reportService: ReportManagerService,
    private toasterService: ToastrService,
    private rolebasedPermissions: RolebasedPermissionService,
    private shared: SharedService
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetReportsGlobalSearch), take(1))
      .subscribe((value: string) => {
        this.searchValue = value;
      });
    this.subscriptions.add(observer);
    this.columnDefs = [];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(ReportsColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No Records To Show',
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadReports();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateReportsGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetReportsCurrentPage(page));
    this.loadReports();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateReportsPerPage(perPage));
    this.loadReports();
  }

  loadReports(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.reportService.getReportRecords().subscribe(
      (reports: ReportsList) => {
        this.pagination = reports.pagination;
        reports.download_queues.forEach((report) => {
          report.created_at = this.shared.getIstFormattedDate(report.created_at);
        });
        this.reports = reports.download_queues;
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
  onDownload(params: ICellRendererParams): void {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', params.data.report_download_link);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
