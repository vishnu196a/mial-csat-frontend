import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { SubCategoryList, SubCategoryResponse } from '../sub-category.model';
import { SubCategoryService } from '../sub-category.service';
import {
  SetSubCategoryCurrentPage,
  UpdateSubCategoryGlobalSearch,
  UpdateSubCategoryPerPage,
} from '../store/sub-category.actions';
import { GetUserGlobalSearch } from '../store/sub-category.selector';
import { UserColumnDefs } from './sub-category.columns';
import { CategoryService } from '@secure/category/category.service';
import { Category } from '@secure/category/category.model';

@Component({
  templateUrl: './list.component.html',
})
export class SubCategoryListComponent implements OnInit, OnDestroy {
  categories: SubCategoryResponse[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  deleteModelContent: DeleteModelContent;
  permissionList: typeof PERMISSION_LIST;
  private categoryId: number;
  isLoading: boolean = false;
  categoryName: string;
  constructor(
    private store: Store<AppState>,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private toasterService: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private rolebasedPermissions: RolebasedPermissionService
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params.id;
    this.getCategoryDetails();

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
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(UserColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No sub-category to show.',
    };
    this.deleteModelContent = {
      title: 'Delete Sub-Category',
      message: 'Are you sure want to delete the sub-category?.',
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadSubCategories();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateSubCategoryGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetSubCategoryCurrentPage(page));
    this.loadSubCategories();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateSubCategoryPerPage(perPage));
    this.loadSubCategories();
  }
  getCategoryDetails(): void {
    const observer = this.categoryService.getCategoryDetails(this.categoryId).subscribe(
      (category: Category) => {
        this.categoryName = category.name;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
      }
    );
    this.subscriptions.add(observer);
  }

  loadSubCategories(): void {
    this.isLoading = true;
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.subCategoryService.getSubCategoryList(this.categoryId).subscribe(
      (response: SubCategoryList) => {
        this.isLoading = false;
        this.pagination = response.pagination;
        this.categories = response.sub_categories;
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.isLoading = false;
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }

  onEdit(params: ICellRendererParams): void {
    const subCategoryId = params.data.id;
    this.router.navigate(['/categories', this.categoryId, 'sub-categories', subCategoryId, 'edit']);
  }
  onAddSubCategory(): void {
    this.router.navigate(['/categories', this.categoryId, 'sub-categories', 'new']);
  }

  onDelete(params: SubCategoryResponse): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.subCategoryService.delete(this.categoryId, params.id).subscribe(
      (response: DeleteResponse) => {
        this.toasterService.success(response.message);
        if (this.categories.length < 2) {
          this.store.dispatch(new SetSubCategoryCurrentPage(1));
        }
        this.loadSubCategories();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
}
