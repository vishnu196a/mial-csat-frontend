import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import {
  ColDef,
  ColumnState,
  GridReadyEvent,
  ICellRendererParams,
  ValueGetterParams,
} from 'ag-grid-community';
import { ChartOptions, ChartType } from 'chart.js';
import moment from 'moment';
import { Label } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { CategoryReportsDetails, CategoryReportsList } from '../category-reports-list.model';
import { CategoryReportsListService } from '../category-reports-list.service';
import {
  CategoryReportsColumnSearch,
  SetCategoryReportsCurrentPage,
  UpdateCategoryReportsGlobalSearch,
  UpdateCategoryReportsPerPage,
} from '../store/category-reports-list.actions';
import { GetCategoryReportsGlobalSearch } from '../store/category-reports-list.selector';
import { CategoryReportsColumnDefs } from './category-reports-list.columns';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class CategoryReportsListComponent implements OnInit, OnDestroy {
  columnDefs: ColDef[];
  defaultColumDefs: ColDef;
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  pagination: Pagination;
  permissionList: typeof PERMISSION_LIST;
  searchValue: string;
  categoryReports: CategoryReportsDetails[] | [];
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
  toDateValidator: boolean = false;
  fromDate: string = moment().startOf('month').format('yyyy-MM-DD HH:mm');
  toDate: string = moment().format('yyyy-MM-DD HH:mm');
  maxDate = moment().format('YYYY-MM-DD HH:mm');
  minDate = moment(this.maxDate).subtract(1, 'year').format('YYYY-MM-DD HH:mm');
  constructor(
    private store: Store<AppState>,
    private toasterService: ToastrService,
    private CategoryReportsService: CategoryReportsListService,
    private rolebasedPermissions: RolebasedPermissionService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetCategoryReportsGlobalSearch))
      .subscribe((value: string) => {
        this.searchValue = value;
      });
    this.subscriptions.add(observer);
    this.initializeColumn();
    this.getChartData();
  }
  getChartData(): void {
    const observer = this.CategoryReportsService.getCategoryChartData(
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

  initializeColumn(): void {
    this.columnDefs = [
      {
        headerName: 'S.No',
        width: S_NO_WIDTH,
        floatingFilter: false,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(CategoryReportsColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No Category Reports to show.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }

  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new CategoryReportsColumnSearch(searchData));
    this.onPageChange(1);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadCategoryReport();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateCategoryReportsGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetCategoryReportsCurrentPage(page));
    this.loadCategoryReport();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateCategoryReportsPerPage(perPage));
    this.loadCategoryReport();
  }

  loadCategoryReport(sendDate?: boolean, sort?: ColumnState): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const from = this.fromDate ? moment(this.fromDate).format('yyyy-MM-DD HH:mm') : '';
    const to = this.toDate ? moment(this.toDate).format('yyyy-MM-DD HH:mm') : '';
    const listObservable = sendDate
      ? this.CategoryReportsService.getCategoryReports(from, to, sort)
      : this.CategoryReportsService.getCategoryReports();
    const observer = listObservable.subscribe(
      (response: CategoryReportsList) => {
        this.pagination = response.pagination;
        this.categoryReports = response.category_reports;
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
    this.router.navigate([
      '/category_reports',
      params.data.id,
      { from: this.fromDate, to: this.toDate },
    ]);
  }
  getListData(): void {
    if (moment(this.fromDate) > moment(this.toDate)) {
      this.toDateValidator = true;
    } else {
      this.toDateValidator = false;
      this.loadCategoryReport(true);
      this.getChartData();
    }
  }
  onSortChanged(params: ColumnState[]): void {
    params = params.filter((data) => data.sort);
    this.loadCategoryReport(true, ...params);
  }
  onDownload(params: ICellRendererParams): void {
    const observer = this.CategoryReportsService.downloadSubCategoryData(
      params.data.id,
      this.fromDate,
      this.toDate
    ).subscribe(
      (response) => {
        const fileName = response.headers.get('content-disposition').split('=')[1];
        const blob = new Blob([response.body], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        this.downloadData(blob, fileName);
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
      }
    );
    this.subscriptions.add(observer);
  }
  downloadCategoryReport(): void {
    const observer = this.CategoryReportsService.downloadCategoryData(
      this.fromDate,
      this.toDate
    ).subscribe(
      (response) => {
        const fileName = response.headers.get('content-disposition').split('=')[1];
        const blob = new Blob([response.body], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        this.downloadData(blob, fileName);
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
      }
    );
    this.subscriptions.add(observer);
  }
  downloadData(blob: Blob, fileName: string): void {
    const a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = `${fileName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
