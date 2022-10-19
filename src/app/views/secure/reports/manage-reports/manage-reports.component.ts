import { Component, OnDestroy, OnInit } from '@angular/core';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST } from '@shared/constants/constants';
import { ErrorResponse } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ManageReport, StaticReports } from '../report-manager.model';
import { ReportManagerService } from '../report-manager.service';
import { FilterComponentComponent } from './filter-component/filter-component.component';
import { StaticReportColumnDefs } from './reports.columns';

@Component({
  selector: 'app-manage-reports',
  templateUrl: './manage-reports.component.html',
})
export class ManageReportsComponent implements OnInit, OnDestroy {
  reports: ManageReport[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  permissionList: typeof PERMISSION_LIST;
  defaultColumDefs: ColDef;
  modalRef: BsModalRef;

  toDateValidator: boolean = false;

  constructor(
    private reportService: ReportManagerService,
    private toasterService: ToastrService,
    private rolebasedPermissions: RolebasedPermissionService,
    public modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    this.columnDefs = [];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(StaticReportColumnDefs);
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

  loadReports(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.reportService.getStaticReport().subscribe(
      (reports: StaticReports) => {
        this.reports = reports.manager_reports;
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }

  openModal(params: ICellRendererParams): void {
    this.modalRef = this.modalService.show(FilterComponentComponent, {});
    this.modalRef.content.params = params.data;
  }
}
