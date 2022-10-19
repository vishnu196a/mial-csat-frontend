import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { CategoryReportsDetails } from '@secure/category-reports-list/category-reports-list.model';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, ColumnState, GridReadyEvent, ValueGetterParams } from 'ag-grid-community';
import { ChartOptions, ChartType } from 'chart.js';
import moment from 'moment';
import { Label } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import {
  SetSubCategoryReportsCurrentPage,
  SubCategoryReportsColumnSearch,
  UpdateSubCategoryReportsGlobalSearch,
  UpdateSubCategoryReportsPerPage,
} from '../store/sub-category-reports-list.actions';
import { GetSubCategoryReportsGlobalSearch } from '../store/sub-category-reports-list.selector';
import { SubCategoryReports, SubCategoryReportsList } from '../sub-category-reports-list.model';
import { SubCategoryReportsListService } from '../sub-category-reports-list.service';
import { SubCategoryReportsColumnDefs } from './sub-category-reports-list.columns';

@Component({
  templateUrl: './list.component.html',
})
export class SubCategoryReportsListComponent implements OnInit, OnDestroy {
  columnDefs: ColDef[];
  defaultColumDefs: ColDef;
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  pagination: Pagination;
  permissionList: typeof PERMISSION_LIST;
  searchValue: string;
  isLoading: boolean = false;
  subCategoryReports: SubCategoryReports[] | [];
  categoryId: number;
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
    },
  };
  pieChartLabels: Label[] = [];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  showPieChart = false;
  fromDate: string;
  toDate: string;
  toDateValidator: boolean = false;
  maxDate = moment().format('YYYY-MM-DD');
  minDate = moment(this.maxDate).subtract(1, 'year').format('YYYY-MM-DD');
  topThreeRecords: CategoryReportsDetails[] = [];
  constructor(
    private store: Store<AppState>,
    private toasterService: ToastrService,
    private SubCategoryReportsService: SubCategoryReportsListService,
    private rolebasedPermissions: RolebasedPermissionService,
    private route: ActivatedRoute
  ) {
    this.fromDate = this.route.snapshot.params.from;
    this.toDate = this.route.snapshot.params.to;
  }
  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetSubCategoryReportsGlobalSearch))
      .subscribe((value: string) => {
        this.searchValue = value;
      });
    this.subscriptions.add(observer);
    this.categoryId = this.route.snapshot.params.id;
    this.initializeColumn();
    this.getChartData();
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
    const updatedColDefs = this.rolebasedPermissions.checkColumns(SubCategoryReportsColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No Sub Category Reports to show.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }
  getChartData(): void {
    const observer = this.SubCategoryReportsService.getSubCategoryChartData(
      this.categoryId,
      this.fromDate,
      this.toDate
    ).subscribe(
      (response: CategoryReportsDetails[]) => {
        const lables = [];
        const value = [];
        response.forEach((data) => {
          if (data.percentage > 0) {
            lables.push(`${data.name}-${data.percentage}%`);
            value.push(data.percentage);
          }
        });
        this.pieChartData = value;
        this.pieChartLabels = lables;
        this.showPieChart = lables.length > 0;
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new SubCategoryReportsColumnSearch(searchData));
    this.onPageChange(1);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadSubCategoryReport();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateSubCategoryReportsGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetSubCategoryReportsCurrentPage(page));
    this.loadSubCategoryReport();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateSubCategoryReportsPerPage(perPage));
    this.loadSubCategoryReport();
  }

  loadSubCategoryReport(sort?: ColumnState): void {
    this.isLoading = true;
    this.gridReadyEvent.api.showLoadingOverlay();
    const from = this.fromDate ? moment(this.fromDate).format('yyyy-MM-DD HH:mm') : '';
    const to = this.toDate ? moment(this.toDate).format('yyyy-MM-DD HH:mm') : '';
    const observer = this.SubCategoryReportsService.getSubCategoryReports(
      this.categoryId,
      from,
      to,
      sort
    ).subscribe(
      (response: SubCategoryReportsList) => {
        this.isLoading = false;
        this.pagination = response.pagination;
        this.subCategoryReports = response.sub_category_reports;
        this.gridReadyEvent.api.hideOverlay();
        this.getTopThreeRecords();
      },
      (error: ErrorResponse) => {
        this.isLoading = false;
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }
  getListData(): void {
    if (moment(this.fromDate) > moment(this.toDate)) {
      this.toDateValidator = true;
    } else {
      this.toDateValidator = false;
      this.loadSubCategoryReport();
      this.getChartData();
    }
  }
  getTopThreeRecords(): void {
    const from = this.fromDate ? moment(this.fromDate).format('yyyy-MM-DD HH:mm') : '';
    const to = this.toDate ? moment(this.toDate).format('yyyy-MM-DD HH:mm') : '';
    const observer = this.SubCategoryReportsService.getTopThreeRecords(
      this.categoryId,
      from,
      to
    ).subscribe(
      (response: CategoryReportsDetails[]) => {
        this.topThreeRecords = response;
      },
      (error: ErrorResponse) => {
        this.isLoading = false;
        this.toasterService.error(error.message);
      }
    );
    this.subscriptions.add(observer);
  }
  onSortChange(params: ColumnState[]): void {
    params = params.filter((data) => data.sort);
    this.loadSubCategoryReport(...params);
  }
}
