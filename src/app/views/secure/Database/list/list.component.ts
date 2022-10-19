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
import { CMS, CmsList } from '../cms.model';
import { CmsService } from '../cms.service';
import {
  CmsColumnSearch,
  SetCmsCurrentPage,
  UpdateCmsGlobalSearch,
  UpdateCmsPerPage,
} from '../store/cms.actions';
import { GetUserGlobalSearch } from '../store/cms.selector';
import { CmsColumnDefs } from './cms.columns';

@Component({
  templateUrl: './list.component.html',
})
export class CmsListComponent implements OnInit, OnDestroy {
  contents: CMS[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  deleteModelContent: DeleteModelContent;
  permissionList: typeof PERMISSION_LIST;
  defaultColumDefs: ColDef;

  constructor(
    private store: Store<AppState>,
    private cmsService: CmsService,
    private router: Router,
    private toasterService: ToastrService,
    private rolebasedPermissions: RolebasedPermissionService
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetUserGlobalSearch), take(1))
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
    const updatedColDefs = this.rolebasedPermissions.checkColumns(CmsColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No Database to show.',
    };
    this.deleteModelContent = {
      title: 'Delete data',
      message: 'Are you sure want to delete the data?.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new CmsColumnSearch(searchData));
    this.onPageChange(1);
  }
  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadContents();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateCmsGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetCmsCurrentPage(page));
    this.loadContents();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateCmsPerPage(perPage));
    this.loadContents();
  }

  loadContents(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.cmsService.getCmsList().subscribe(
      (response: CmsList) => {
        this.pagination = response.pagination;
        this.contents = response.content_management_system;
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
    this.router.navigate(['/database', params.data.id]);
  }
  onEdit(params: ICellRendererParams): void {
    const contentId = params.data.id;
    this.router.navigate(['/database', contentId, 'edit']);
  }
  onDelete(params: CMS): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.cmsService.delete(params.id).subscribe(
      () => {
        this.toasterService.success('Successfully deleted the data');
        this.loadContents();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
  onHelpSOS(): void {
    this.router.navigate(['/database', 'helpSOS']);
  }
}
