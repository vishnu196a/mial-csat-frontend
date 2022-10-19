import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import {
  DeleteModelContent,
  ErrorResponse,
  FloatingFilterSearchData,
  Pagination,
} from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import {
  SetTerminalInfoCurrentPage,
  TerminalInfoColumnSearch,
  UpdateTerminalInfoGlobalSearch,
  UpdateTerminalInfoPerPage,
} from '../store/terminal-info.actions';
import { GetTerminalInfoGlobalSearch } from '../store/terminal-info.selector';
import { TerminalInfoList, TerminalInfoResponse } from '../terminal-info.model';
import { TerminalInfoService } from '../terminal-info.service';
import { TerminalInfoColumnDefs } from './terminal-info.columns';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, OnDestroy {
  terminalInfoList: TerminalInfoResponse[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  permissionList: typeof PERMISSION_LIST;
  defaultColumDefs: ColDef;
  deleteModelContent: DeleteModelContent;

  constructor(
    private store: Store<AppState>,
    private terminalInfoService: TerminalInfoService,
    private toasterService: ToastrService,
    private rolebasedPermissions: RolebasedPermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetTerminalInfoGlobalSearch))
      .subscribe((value: string) => {
        this.searchValue = value;
      });
    this.subscriptions.add(observer);
    this.initializeColumn();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  initializeColumn(): void {
    this.columnDefs = [
      {
        headerName: 'S.No',
        maxWidth: S_NO_WIDTH,
        floatingFilter: false,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(TerminalInfoColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No terminal informations to show.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
    this.deleteModelContent = {
      title: 'Delete terminal information',
      message: 'Are you sure want to delete the terminal information?.',
    };
  }

  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new TerminalInfoColumnSearch(searchData));
    this.onPageChange(1);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadTerminalInformations();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateTerminalInfoGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetTerminalInfoCurrentPage(page));
    this.loadTerminalInformations();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateTerminalInfoPerPage(perPage));
    this.loadTerminalInformations();
  }

  loadTerminalInformations(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.terminalInfoService.getTerminalInfoList().subscribe(
      (response: TerminalInfoList) => {
        this.pagination = response.pagination;
        this.terminalInfoList = response.terminal_informations;
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
  onEdit(params: ICellRendererParams): void {
    const tInfoId = params.data.id;
    this.router.navigate(['/terminal_info', tInfoId, 'edit']);
  }

  onDelete(params: TerminalInfoResponse): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.terminalInfoService.deleteTerminalInfo(params.id.toString()).subscribe(
      () => {
        this.toasterService.success('Successfully deleted the terminal information');
        this.loadTerminalInformations();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
}
