import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { FORM_STATUS_COLOUR, PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import {
  SetSurveyCurrentPage,
  SurveyColumnSearch,
  UpdateSurveyGlobalSearch,
  UpdateSurveyPerPage,
} from '../store/survey-list.actions';
import { GetSurveyGlobalSearch } from '../store/survey-list.selector';
import { SurveyForm, SurveyList } from '../survey-list.model';
import { SurveyListService } from '../survey-list.service';
import { SurveyColumnDefs } from './survey-list.columns';

@Component({
  templateUrl: './list.component.html',
})
export class SurveyListComponent implements OnInit, OnDestroy {
  columnDefs: ColDef[];
  defaultColumDefs: ColDef;
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  pagination: Pagination;
  permissionList: typeof PERMISSION_LIST;
  searchValue: string;
  survey: SurveyForm[] | [];
  constructor(
    private store: Store<AppState>,
    private toasterService: ToastrService,
    private surveyService: SurveyListService,
    private rolebasedPermissions: RolebasedPermissionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store.pipe(select(GetSurveyGlobalSearch)).subscribe((value: string) => {
      this.searchValue = value;
    });
    this.subscriptions.add(observer);
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
    const updatedColDefs = this.rolebasedPermissions.checkColumns(SurveyColumnDefs);
    this.columnDefs.push(...updatedColDefs, {
      field: 'is_active',
      headerName: 'Status',
      cellStyle: (params) => {
        return {
          color: FORM_STATUS_COLOUR[params.data.is_active],
          'text-transform': 'capitalize',
        };
      },
    });
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No Survey Forms to show.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }

  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new SurveyColumnSearch(searchData));
    this.onPageChange(1);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadSurvey();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateSurveyGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetSurveyCurrentPage(page));
    this.loadSurvey();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateSurveyPerPage(perPage));
    this.loadSurvey();
  }

  loadSurvey(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.surveyService.getSurvey().subscribe(
      (response: SurveyList) => {
        this.pagination = response.pagination;
        response.survey_forms.map((data) => {
          data.is_active = data.is_active ? 'Active' : 'InActive';
        });
        this.survey = response.survey_forms;
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
    this.router.navigate(['survey_form', params.data.id]);
  }
  onDisable(params: ICellRendererParams): void {
    const observer = this.surveyService.disableForm(params.data.id).subscribe(
      () => {
        this.toasterService.success('Survey form successfully deactivated');
        this.router.navigate(['/survey_form']);
        this.loadSurvey();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
      }
    );
    this.subscriptions.add(observer);
  }
  onReportClick(params: ICellRendererParams): void {
    this.router.navigate(['survey_form', 'report', params.data.id]);
  }
}
