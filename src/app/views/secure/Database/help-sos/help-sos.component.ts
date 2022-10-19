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
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { Sos, SosList } from '../cms.model';
import { CmsService } from '../cms.service';
import { SOSColumnDefs } from './help-sos.columns';
import {
  SetSosCurrentPage,
  SosColumnSearch,
  UpdateSosGlobalSearch,
  UpdateSosPerPage,
} from './store/help-sos.actions';
import { GetSosGlobalSearch } from './store/help-sos.selector';

@Component({
  templateUrl: './help-sos.component.html',
})
export class HelpSosComponent implements OnInit, OnDestroy {
  sos: Sos[] | [];
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
    private cmsService: CmsService,
    private toasterService: ToastrService,
    private rolebasedPermissions: RolebasedPermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetSosGlobalSearch), take(1))
      .subscribe((value: string) => {
        this.searchValue = value;
      });
    this.subscriptions.add(observer);
    this.columnDefs = [
      {
        headerName: 'S.No',
        maxWidth: S_NO_WIDTH,
        floatingFilter: false,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(SOSColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No SOS HelpLine To Show',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
    this.deleteModelContent = {
      title: 'Delete SOS Helpline Number',
      message: 'Are you sure want to delete the SOS Helpline Number?.',
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new SosColumnSearch(searchData));
    this.onPageChange(1);
  }
  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadSosList();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateSosGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetSosCurrentPage(page));
    this.loadSosList();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateSosPerPage(perPage));
    this.loadSosList();
  }

  loadSosList(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.cmsService.getSosList().subscribe(
      (response: SosList) => {
        this.pagination = response.pagination;
        this.sos = response.extensions_types;
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
    const sosId = params.data.id;
    this.router.navigate(['/database/helpSOS', sosId, 'edit_helpSOS']);
  }
  onDelete(params: Sos): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.cmsService.deleteSosHelpDesk(params.id).subscribe(
      () => {
        this.toasterService.success('Successfully deleted the SOS Helpline Number');
        this.loadSosList();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
}
