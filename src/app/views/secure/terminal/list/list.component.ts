import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import {
  DeleteModelContent,
  DeleteResponse,
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
  SetTerminalCurrentPage,
  TerminalColumnSearch,
  UpdateTerminalGlobalSearch,
  UpdateTerminalPerPage,
} from '../store/terminal.actions';
import { GetTerminalGlobalSearch } from '../store/terminal.selector';
import { TerminalList, TerminalResponse } from '../terminal.model';
import { TerminalService } from '../terminal.service';
import { TerminalColumnDefs } from './terminal.columns';

@Component({
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit, OnDestroy {
  terminalList: TerminalResponse[] | [];
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
    private terminalService: TerminalService,
    private toasterService: ToastrService,
    private router: Router,
    private rolebasedPermissions: RolebasedPermissionService
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store.pipe(select(GetTerminalGlobalSearch)).subscribe((value: string) => {
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
    const updatedColDefs = this.rolebasedPermissions.checkColumns(TerminalColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No terminal locations to show.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
    this.deleteModelContent = {
      title: 'Delete terminal location',
      message: 'Are you sure want to delete the terminal location?.',
    };
  }

  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new TerminalColumnSearch(searchData));
    this.onPageChange(1);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadTerminals();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateTerminalGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetTerminalCurrentPage(page));
    this.loadTerminals();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateTerminalPerPage(perPage));
    this.loadTerminals();
  }

  loadTerminals(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.terminalService.getTerminalList().subscribe(
      (response: TerminalList) => {
        this.pagination = response.pagination;
        this.terminalList = response.terminals;
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
  onView(params: ICellRendererParams): void {
    this.router.navigate(['terminals', params.data.id]);
  }
  onEdit(params: ICellRendererParams): void {
    const terminalId = params.data.id;
    this.router.navigate(['/terminals', terminalId, 'edit']);
  }
  onDelete(params: TerminalResponse): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.terminalService.delete(params.id).subscribe(
      (response: DeleteResponse) => {
        this.toasterService.success(response.message);
        if (this.terminalList.length < 2) {
          this.store.dispatch(new SetTerminalCurrentPage(1));
        }
        this.loadTerminals();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
}
