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
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import {
  SetUserCurrentPage,
  UpdateUserGlobalSearch,
  UpdateUserPerPage,
  UserColumnSearch,
} from '../store/user.actions';
import { GetUserGlobalSearch } from '../store/user.selector';
import { UserList, UserResponse } from '../user.model';
import { UserService } from '../user.service';
import { UserColumnDefs } from './user.columns';

@Component({
  templateUrl: './list.component.html',
})
export class UserListComponent implements OnInit, OnDestroy {
  users: UserResponse[] | [];
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
    private userService: UserService,
    private toasterService: ToastrService,
    private router: Router,
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
        width: S_NO_WIDTH,
        floatingFilter: false,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(UserColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No users to show.',
    };
    this.deleteModelContent = {
      title: 'Delete user',
      message: 'Are you sure want to delete the user?.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }
  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new UserColumnSearch(searchData));
    this.onPageChange(1);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadUsers();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateUserGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetUserCurrentPage(page));
    this.loadUsers();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateUserPerPage(perPage));
    this.loadUsers();
  }

  loadUsers(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.userService.getUsers().subscribe(
      (response: UserList) => {
        this.pagination = response.pagination;
        this.users = response.users;
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
    const userId = params.data.id;
    this.router.navigate(['/users', userId, 'edit']);
  }

  onDelete(params: UserResponse): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.userService.delete(params.id).subscribe(
      (response: DeleteResponse) => {
        this.toasterService.success(response.message);
        if (this.users.length < 2) {
          this.store.dispatch(new SetUserCurrentPage(1));
        }
        this.loadUsers();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }

  onInvite(params: ICellRendererParams): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const user: UserResponse = params.data;
    this.userService.sendInvitation(user.id).subscribe(
      (response) => {
        this.toasterService.success(response.message);
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.toasterService.success(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
  }
}
