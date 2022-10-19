import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { SharedService } from '@shared/services/shared.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { CallBackList, Calls, CallsState } from '../abandoned-calls.model';
import { AbandonedCallsService } from '../abandoned-calls.service';
import { CallBackColumnDefs } from './callBack-list.columns';
import {
  CallBackColumnSearch,
  SetCallBackCurrentPage,
  UpdateCallBackGlobalSearch,
  UpdateCallBackPerPage,
} from './store/callback-calls.actions';
import { GetCallBackGlobalSearch, GetCallsState } from './store/callback-calls.selector';

@Component({
  selector: 'app-callback-list',
  templateUrl: './callback-list.component.html',
})
export class CallbackListComponent implements OnInit, OnDestroy {
  columnDefs: ColDef[];
  defaultColumDefs: ColDef;
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  pagination: Pagination;
  permissionList: typeof PERMISSION_LIST;
  searchValue: string;
  callBackCalls: Calls[] | [];
  fromDate: string;
  toDate: string;
  toDateValidator: boolean = false;
  constructor(
    private store: Store<AppState>,
    private toasterService: ToastrService,
    private abandonedCallsService: AbandonedCallsService,
    private rolebasedPermissions: RolebasedPermissionService,
    private router: Router,
    private shared: SharedService
  ) {}
  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store.pipe(select(GetCallBackGlobalSearch)).subscribe((value: string) => {
      this.searchValue = value;
    });
    this.subscriptions.add(observer);
    const stateObserver = this.store.select(GetCallsState).subscribe((state: CallsState) => {
      this.fromDate = state.columns.from.toString();
      this.toDate = state.columns.to.toString();
    });
    this.subscriptions.add(stateObserver);
    this.initializeColumn();
  }
  initializeColumn(): void {
    this.columnDefs = [
      {
        headerName: 'S.No',
        width: S_NO_WIDTH,
        floatingFilter: false,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(CallBackColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No call back calls to show.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }

  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new CallBackColumnSearch(searchData));
    this.onPageChange(1);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadCallBackCalls();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateCallBackGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetCallBackCurrentPage(page));
    this.loadCallBackCalls();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateCallBackPerPage(perPage));
    this.loadCallBackCalls();
  }

  loadCallBackCalls(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.abandonedCallsService.getCallBackCalls().subscribe(
      (response: CallBackList) => {
        this.pagination = response.pagination;
        if (response.call_back_queues.length > 0) {
          response.call_back_queues.forEach((calls) => {
            calls.date_and_time = this.shared.getIstFormattedDate(calls.date_and_time);
          });
        }
        this.callBackCalls = response.call_back_queues;
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
    const callId = params.data.id;
    localStorage.setItem('CallFrom', 'A');
    this.router.navigate(['/abandoned_calls', callId, 'tag']);
  }

  handleFilter(param: string, value: string): void {
    if (moment.utc(this.fromDate) > moment.utc(this.toDate)) {
      this.toDateValidator = true;
    } else {
      this.toDateValidator = false;
      this.store.dispatch(new CallBackColumnSearch({ [param]: value }));
      this.loadCallBackCalls();
    }
  }
}
