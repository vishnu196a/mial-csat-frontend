import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { GLOBAL_SEARCH_DELAY, PERMISSION_LIST } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, ColumnState, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { debounce } from 'lodash';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { FlightStatusList, FlightStatusResponse, FlightStatusState } from '../flight-status.model';
import { FlightStatusService } from '../flight-status.service';
import {
  FlightStatusClearPagination,
  FlightStatusColumnSearch,
  SetFlightStatusCurrentPage,
  UpdateFlightStatusGlobalSearch,
  UpdateFlightStatusPerPage,
} from '../store/flight-status.actions';
import { GetFlightStatusGlobalSearch, GetFlightStatusState } from '../store/flight-status.selector';
import { FlightStatusColumnDefs } from './flight-status.columns';
import { SharedService } from '@shared/services/shared.service';

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class FlightStatusListComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store<AppState>,
    private flightStatusService: FlightStatusService,
    private toasterService: ToastrService,
    private router: Router,
    private rolebasedPermissions: RolebasedPermissionService,
    private shared: SharedService
  ) {}
  flightStatus: FlightStatusResponse[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  permissionList: typeof PERMISSION_LIST;
  defaultColumDefs: ColDef;
  flightType: string;
  scheduleType: string;
  fromDate: string;
  toDate: string;
  airline: string;
  flightNo: string;
  origin: string;
  destination: string;
  toDateValidator: boolean = false;
  handleFilter = debounce(function (filterColumn: string, value: string): void {
    if (filterColumn === 'from' || filterColumn === 'to') {
      if (moment.utc(this.fromDate) > moment.utc(this.toDate)) {
        this.toDateValidator = true;
      } else {
        this.toDateValidator = false;
        this.store.dispatch(new FlightStatusColumnSearch({ [filterColumn]: value }));
        if (filterColumn === 'from') {
          this.store.dispatch(
            new FlightStatusColumnSearch({
              to: moment(this.fromDate).add(1, 'days').format('YYYY-MM-DD'),
            })
          );
        }
        this.onPageChange(1);
      }
    } else {
      this.store.dispatch(new FlightStatusColumnSearch({ [filterColumn]: value }));
      this.onPageChange(1);
    }
  }, GLOBAL_SEARCH_DELAY);

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetFlightStatusGlobalSearch))
      .subscribe((value: string) => {
        this.searchValue = value;
      });
    const stateObserver = this.store
      .select(GetFlightStatusState)
      .subscribe((state: FlightStatusState) => {
        this.flightType = state.columns.flight_type.toString();
        this.scheduleType = state.columns.schedule_type.toString();
        this.fromDate = state.columns.from.toString();
        this.airline = state.columns.flight_name.toString();
        this.flightNo = state.columns.flight_number.toString();
        this.toDate = state.columns.to.toString();
        this.origin = state.columns.departure_airport_name.toString();
        this.destination = state.columns.arrival_airport_name.toString();
      });
    this.subscriptions.add(observer);
    this.subscriptions.add(stateObserver);

    this.initializeColumn();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  initializeColumn(): void {
    this.columnDefs = [];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(FlightStatusColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No flight status to show.',
    };
    this.defaultColumDefs = {
      comparator: (): number => 0,
      floatingFilter: true,
    };
  }

  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new FlightStatusColumnSearch(searchData));
    this.onPageChange(1);
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadFlightStatus();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateFlightStatusGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetFlightStatusCurrentPage(page));
    this.loadFlightStatus();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateFlightStatusPerPage(perPage));
    this.loadFlightStatus();
  }

  loadFlightStatus(sort?: ColumnState): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.flightStatusService.getFlightStatus(sort).subscribe(
      (response: FlightStatusList) => {
        this.pagination = response.pagination;
        this.flightStatus = response.flight_status;
        this.flightStatus.forEach((details) => {
          details.scheduled_arrival_time = this.shared.getFormattedDate(
            details.scheduled_arrival_time
          );
          details.estimated_arrival_time = this.shared.getFormattedDate(
            details.estimated_arrival_time
          );
          details.actual_arrival_time = this.shared.getFormattedDate(details.actual_arrival_time);
          details.scheduled_departure_time = this.shared.getFormattedDate(
            details.scheduled_departure_time
          );
          details.estimated_departure_time = this.shared.getFormattedDate(
            details.estimated_departure_time
          );
          details.actual_departure_time = this.shared.getFormattedDate(
            details.actual_departure_time
          );
          details.updated_dt = this.shared.getFormattedDate(details.updated_dt);
        });
        this.gridReadyEvent.columnApi.setColumnsVisible(
          ['scheduled_departure_time', 'estimated_departure_time', 'actual_departure_time'],
          this.scheduleType !== 'arrival'
        );
        this.gridReadyEvent.columnApi.setColumnsVisible(
          ['estimated_arrival_time', 'scheduled_arrival_time', 'actual_arrival_time'],
          this.scheduleType === 'arrival'
        );
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
    this.router.navigate(['flight_status', params.data.flight_schedule_id]);
  }
  onRefresh(): void {
    this.store.dispatch(new FlightStatusClearPagination());
    this.loadFlightStatus();
  }
  onSortChange(params: ColumnState[]): void {
    params = params.filter((data) => data.sort);
    this.loadFlightStatus(...params);
  }
  handleFlightType(flightType: string): void {
    this.flightType = flightType;
    this.store.dispatch(new FlightStatusColumnSearch({ flight_type: this.flightType }));
    this.onPageChange(1);
  }

  handleScheduleType(scheduleType: string): void {
    this.scheduleType = scheduleType;
    this.store.dispatch(new FlightStatusColumnSearch({ schedule_type: this.scheduleType }));
    this.onPageChange(1);
  }
  onDoubleClick(params: ICellRendererParams): void {
    this.router.navigate(['flight_status', params.data.flight_schedule_id]);
  }
}
