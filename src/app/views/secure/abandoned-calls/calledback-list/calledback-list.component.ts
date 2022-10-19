import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { SharedService } from '@shared/services/shared.service';
import { ColDef, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { CalledBack, CalledBackList, CallsState } from '../abandoned-calls.model';
import { AbandonedCallsService } from '../abandoned-calls.service';
import { CalledBackColumnDefs } from './calledBack-list.columns';
import {
  CalledBackColumnSearch,
  SetCalledBackCurrentPage,
  UpdateCalledBackGlobalSearch,
  UpdateCalledBackPerPage,
} from './store/calledback-calls.actions';
import { GetCalledBackGlobalSearch, GetCallsState } from './store/calledback-calls.selector';

@Component({
  selector: 'app-calledback-list',
  templateUrl: './calledback-list.component.html',
})
export class CalledbackListComponent implements OnInit, OnDestroy {
  columnDefs: ColDef[];
  defaultColumDefs: ColDef;
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  pagination: Pagination;
  permissionList: typeof PERMISSION_LIST;
  searchValue: string;
  calledBackCalls: CalledBack[] | [];
  fromDate: string;
  toDate: string;
  toDateValidator: boolean = false;
  constructor(
    private store: Store<AppState>,
    private toasterService: ToastrService,
    private abandonedCallsService: AbandonedCallsService,
    private rolebasedPermissions: RolebasedPermissionService,
    private shared: SharedService
  ) {}
  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetCalledBackGlobalSearch))
      .subscribe((value: string) => {
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
    const updatedColDefs = this.rolebasedPermissions.checkColumns(CalledBackColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No called back calls to show.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }

  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new CalledBackColumnSearch(searchData));
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
    this.store.dispatch(new UpdateCalledBackGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetCalledBackCurrentPage(page));
    this.loadCallBackCalls();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateCalledBackPerPage(perPage));
    this.loadCallBackCalls();
  }

  loadCallBackCalls(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.abandonedCallsService.getCalledBackCalls().subscribe(
      (response: CalledBackList) => {
        this.pagination = response.pagination;
        if (response.called_back_queues.length > 0) {
          response.called_back_queues.forEach((calls) => {
            calls.date_and_time = this.shared.getIstFormattedDate(calls.date_and_time);
          });
        }
        this.calledBackCalls = response.called_back_queues;
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }

  handleFilter(param: string, value: string): void {
    if (moment.utc(this.fromDate) > moment.utc(this.toDate)) {
      this.toDateValidator = true;
    } else {
      this.toDateValidator = false;
      this.store.dispatch(new CalledBackColumnSearch({ [param]: value }));
      this.loadCallBackCalls();
    }
  }
}
