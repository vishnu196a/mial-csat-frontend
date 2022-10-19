import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import {
  CallTagsColumnSearch,
  SetCallTagsCurrentPage,
  UpdateCallTagsGlobalSearch,
  UpdateCallTagsPerPage,
} from '@secure/call-tags/store/call-tags.actions';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { SharedService } from '@shared/services/shared.service';
import {
  ColDef,
  ColumnState,
  GridReadyEvent,
  ICellRendererParams,
  ValueGetterParams,
} from 'ag-grid-community';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { CallTags, CallTagsList, CallTagsState } from '../call-tags.model';
import { CallTagsService } from '../call-tags.service';
import { GetCallTagsGlobalSearch, GetCallTagState } from '../store/call-tags.selector';
import { CallTagsColumnDefs } from './call-tags.columns';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class CallTagsComponent implements OnInit, OnDestroy {
  pagination: Pagination;
  subscriptions = new Subscription();
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  CallTags: CallTags[] = [];
  permissionList: typeof PERMISSION_LIST;
  searchValue: string;
  defaultColumDefs: ColDef;
  fromDate: string;
  toDate: string;
  maxDate = moment().format('YYYY-MM-DD');
  minDate = moment(this.maxDate).subtract(1, 'year').format('YYYY-MM-DD');
  toDateValidator: boolean = false;
  constructor(
    private callTagsService: CallTagsService,
    private store: Store<AppState>,
    private rolebasedPermissions: RolebasedPermissionService,
    private toasterService: ToastrService,
    private shared: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store.pipe(select(GetCallTagsGlobalSearch)).subscribe((value: string) => {
      this.searchValue = value;
    });

    const stateObserver = this.store.select(GetCallTagState).subscribe((state: CallTagsState) => {
      this.fromDate = state.columns.from.toString();
      this.toDate = state.columns.to.toString();
    });
    this.subscriptions.add(stateObserver);
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
        width: S_NO_WIDTH,
        floatingFilter: false,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(CallTagsColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No calls Tags to show.',
    };
    this.defaultColumDefs = {
      comparator: (): number => 0,
      floatingFilter: true,
    };
  }
  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new CallTagsColumnSearch(searchData));
    this.onPageChange(1);
  }
  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.getCallTags();
  }
  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateCallTagsGlobalSearch(event));
  }
  onSearch(): void {
    this.onPageChange(1);
  }
  onPageChange(page: number): void {
    this.store.dispatch(new SetCallTagsCurrentPage(page));
    this.getCallTags();
  }
  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateCallTagsPerPage(perPage));
    this.getCallTags();
  }

  onSortChange(params: ColumnState[]): void {
    params = params.filter((data) => data.sort);
    this.getCallTags(...params);
  }

  getCallTags(sort?: ColumnState): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.callTagsService.getCallTags(sort).subscribe(
      (response: CallTagsList) => {
        this.CallTags = response.call_tags;
        this.pagination = response.pagination;
        this.gridReadyEvent.api.hideOverlay();
        this.CallTags.forEach((calls) => {
          calls.call_answer_time = this.shared.getIstFormattedDate(calls.call_answer_time);
          calls.date_and_time = this.shared.getIstFormattedDate(calls.date_and_time);
        });
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
  onView(params: ICellRendererParams): void {
    this.router.navigate(['call_tags', params.data.id]);
  }
  handleFilter(param: string, value: string): void {
    if (moment.utc(this.fromDate) > moment.utc(this.toDate)) {
      this.toDateValidator = true;
    } else {
      this.toDateValidator = false;
      this.store.dispatch(new CallTagsColumnSearch({ [param]: value }));
      this.getCallTags();
    }
  }
}
