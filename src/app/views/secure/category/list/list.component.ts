import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import {
  DeleteModelContent,
  DeleteResponse,
  ErrorResponse,
  Pagination,
} from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { CategoryList, CategoryResponse } from '../category.model';
import { CategoryService } from '../category.service';
import {
  SetCategoryCurrentPage,
  UpdateCategoryGlobalSearch,
  UpdateCategoryPerPage,
} from '../store/category.actions';
import { GetCategoryGlobalSearch } from '../store/category.selector';
import { UserColumnDefs } from './category.columns';

@Component({
  templateUrl: './list.component.html',
})
export class CategoryListComponent implements OnInit, OnDestroy {
  categories: CategoryResponse[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  deleteModelContent: DeleteModelContent;
  permissionList: typeof PERMISSION_LIST;

  constructor(
    private store: Store<AppState>,
    private categoryService: CategoryService,
    private toasterService: ToastrService,
    private router: Router,
    private rolebasedPermissions: RolebasedPermissionService
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetCategoryGlobalSearch), take(1))
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
    const updatedColDefs = this.rolebasedPermissions.checkColumns(UserColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No category to show.',
    };
    this.deleteModelContent = {
      title: 'Delete category',
      message: 'Are you sure want to delete the category?.',
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadCategories();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateCategoryGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetCategoryCurrentPage(page));
    this.loadCategories();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateCategoryPerPage(perPage));
    this.loadCategories();
  }

  loadCategories(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.categoryService.getCategoryList().subscribe(
      (response: CategoryList) => {
        this.pagination = response.pagination;
        this.categories = response.categories;
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
    const categoryId = params.data.id;
    this.router.navigate(['/categories', categoryId, 'edit']);
  }

  onDelete(params: CategoryResponse): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.categoryService.delete(params.id).subscribe(
      (response: DeleteResponse) => {
        this.toasterService.success(response.message);
        if (this.categories.length < 2) {
          this.store.dispatch(new SetCategoryCurrentPage(1));
        }
        this.loadCategories();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }

  onView(params: ICellRendererParams): void {
    this.router.navigate(['/categories', params.data.id]);
  }
}
