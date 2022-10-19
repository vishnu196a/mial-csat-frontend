import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { SharedService } from '@shared/services/shared.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { LiveCallColumnDefs } from '../list/live-call.columns';
import { UntagCallList, UntagedCalls } from '../live-call.model';
import { LiveCallService } from '../live-call.service';
import {
  SetUntaggedCurrentPage,
  UpdateUntaggedGlobalSearch,
  UpdateUntaggedPerPage,
} from '../store/untagged-calls.actions';
import { GetUntaggedCallsGlobalSearch } from '../store/untagged-calls.selector';

@Component({
  selector: 'app-untagged-calls',
  templateUrl: './untagged-calls.component.html',
})
export class UntaggedCallsComponent implements OnInit, OnDestroy {
  untaggedCalls: UntagedCalls[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  permissionList: typeof PERMISSION_LIST;

  constructor(
    private store: Store<AppState>,
    private liveCallService: LiveCallService,
    private toasterService: ToastrService,
    private router: Router,
    private shared: SharedService,
    private rolebasedPermissions: RolebasedPermissionService
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetUntaggedCallsGlobalSearch), take(1))
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
    const updatedColDefs = this.rolebasedPermissions.checkColumns(LiveCallColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No untagged calls to show.',
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadUntagCalls();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateUntaggedGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetUntaggedCurrentPage(page));
    this.loadUntagCalls();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateUntaggedPerPage(perPage));
    this.loadUntagCalls();
  }

  loadUntagCalls(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.liveCallService.getUntagCalls().subscribe(
      (unTagCalls: UntagCallList) => {
        this.untaggedCalls = unTagCalls.untaged_call_entries;
        this.pagination = unTagCalls.pagination;
        if (this.untaggedCalls.length > 0) {
          this.untaggedCalls.forEach((calls) => {
            calls.datetime_init = this.shared.getIstFormattedDate(calls.datetime_init);
          });
        }
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
  onTagCall(params: ICellRendererParams): void {
    const callId = params.data.call_entry_id;
    localStorage.setItem('CallFrom', 'C');
    this.router.navigate(['/live_call', callId, 'tag']);
  }
}
