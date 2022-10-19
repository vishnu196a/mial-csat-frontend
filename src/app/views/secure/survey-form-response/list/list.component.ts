import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { SurveyFormResponse, SurveyFormResponseList } from '../survey-form-response.model';
import { SurveyFormResponseService } from '../survey-form-response.service';
import {
  SetSurveyFormResponseCurrentPage,
  UpdateSurveyFormResponseGlobalSearch,
  UpdateSurveyFormResponsePerPage,
  SurveyFormResponseColumnSearch,
} from '../store/survey-form-response.actions';
import { GetSurveyFormResponseGlobalSearch } from '../store/survey-form-response.selector';
import { SurveyFormResponseColumnDefs } from './survey-form-response.columns';
import { Router } from '@angular/router';

@Component({
  templateUrl: './list.component.html',
})
export class SurveyFormResponseListComponent implements OnInit, OnDestroy {
  surveyFormResponse: SurveyFormResponse[] | [];
  columnDefs: ColDef[];
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  pagination: Pagination;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  searchValue: string;
  permissionList: typeof PERMISSION_LIST;
  defaultColumDefs: ColDef;

  constructor(
    private store: Store<AppState>,
    private surveyFormResponseService: SurveyFormResponseService,
    private toasterService: ToastrService,
    private router: Router,
    private rolebasedPermissions: RolebasedPermissionService
  ) {}

  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetSurveyFormResponseGlobalSearch), take(1))
      .subscribe((value: string) => {
        this.searchValue = value;
      });
    this.subscriptions.add(observer);
    this.columnDefs = [
      {
        headerName: 'S.No',
        maxWidth: S_NO_WIDTH,
        floatingFilter: false,
        valueGetter: (params: ValueGetterParams) => params.node.rowIndex + this.pagination.start_at,
      },
    ];
    const updatedColDefs = this.rolebasedPermissions.checkColumns(SurveyFormResponseColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No Responses to show',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new SurveyFormResponseColumnSearch(searchData));
    this.onPageChange(1);
  }
  onGridReady(params: GridReadyEvent): void {
    this.gridReadyEvent = params;
    this.loadContents();
  }

  onSearchChange(event: string): void {
    this.searchValue = event;
    this.store.dispatch(new UpdateSurveyFormResponseGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetSurveyFormResponseCurrentPage(page));
    this.loadContents();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateSurveyFormResponsePerPage(perPage));
    this.loadContents();
  }

  loadContents(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.surveyFormResponseService.getSurveyFormResponseList().subscribe(
      (response: SurveyFormResponseList) => {
        this.pagination = response.pagination;
        this.surveyFormResponse = response.survey_form_responses;
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
    this.router.navigate(['/survey_form_response', params.data.id]);
  }
}
