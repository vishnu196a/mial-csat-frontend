import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SavedTemplates, TemplateList } from '@secure/reports/report-manager.model';
import { ReportManagerService } from '@secure/reports/report-manager.service';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { TemplateListColumnDefs } from './flight-status.columns';
import {
  SetTemplateListCurrentPage,
  TemplateListColumnSearch,
  UpdateTemplateListGlobalSearch,
  UpdateTemplateListPerPage,
} from './store/template-list.actions';
import { GetTemplateListGlobalSearch } from './store/template-list.selector';

@Component({
  templateUrl: './template-list.component.html',
})
export class TemplateListComponent implements OnInit, OnDestroy {
  public select = new EventEmitter<boolean>();
  templates: TemplateList[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;

  constructor(
    private store: Store<AppState>,
    private reportService: ReportManagerService,
    private toasterService: ToastrService,
    public modalRef: BsModalRef,
    private rolebasedPermissions: RolebasedPermissionService
  ) {}

  ngOnInit(): void {
    const observer = this.store
      .pipe(select(GetTemplateListGlobalSearch), take(1))
      .subscribe((value: string) => {
        this.searchValue = value;
      });
    this.subscriptions.add(observer);
    this.columnDefs = [
      {
        headerName: 'S.No',
        maxWidth: S_NO_WIDTH,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(TemplateListColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No templates to show.',
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadTemplates();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateTemplateListGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetTemplateListCurrentPage(page));
    this.loadTemplates();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateTemplateListPerPage(perPage));
    this.loadTemplates();
  }
  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new TemplateListColumnSearch(searchData));
    this.onPageChange(1);
  }
  loadTemplates(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.reportService.getSavedTemplates().subscribe(
      (response: SavedTemplates) => {
        this.templates = response.dynamic_report_templates;
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
  onDoubleClick(params: ICellRendererParams): void {
    this.select.emit(params.data);
  }
}
