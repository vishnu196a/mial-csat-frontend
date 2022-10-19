import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MessageResponse } from '@secure/category/category.model';
import { NoRowsOverlayComponentParams } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.model';
import { PERMISSION_LIST, S_NO_WIDTH } from '@shared/constants/constants';
import { ErrorResponse, FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { ColDef, GridReadyEvent, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import {
  SetSurveyInvitationCurrentPage,
  SurveyInvitationColumnSearch,
  UpdateSurveyInvitationGlobalSearch,
  UpdateSurveyInvitationPerPage,
} from '../store/survey-invitation-list.actions';
import { GetSurveyInvitationGlobalSearch } from '../store/survey-invitation-list.selector';
import { SurveyFormInvitation, SurveyInvitationList } from '../survey-invitation-list.model';
import { SurveyInvitationListService } from '../survey-invitation-list.service';
import { SurveyInvitationColumnDefs } from './survey-invitation-list.columns';

@Component({
  templateUrl: './list.component.html',
})
export class SurveyInvitationListComponent implements OnInit, OnDestroy {
  columnDefs: ColDef[];
  defaultColumDefs: ColDef;
  noRowsOverlayComponentParams: NoRowsOverlayComponentParams;
  gridReadyEvent: GridReadyEvent;
  subscriptions = new Subscription();
  pagination: Pagination;
  permissionList: typeof PERMISSION_LIST;
  searchValue: string;
  surveyInvitation: SurveyFormInvitation[] | [];
  constructor(
    private store: Store<AppState>,
    private toasterService: ToastrService,
    private surveyInvitationService: SurveyInvitationListService,
    private rolebasedPermissions: RolebasedPermissionService
  ) {}
  ngOnInit(): void {
    this.permissionList = PERMISSION_LIST;
    const observer = this.store
      .pipe(select(GetSurveyInvitationGlobalSearch))
      .subscribe((value: string) => {
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
    const updatedColDefs = this.rolebasedPermissions.checkColumns(SurveyInvitationColumnDefs);
    this.columnDefs.push(...updatedColDefs);
    this.noRowsOverlayComponentParams = {
      noRowsMessage: 'No Survey Invitations to show.',
    };
    this.defaultColumDefs = {
      floatingFilter: true,
    };
  }

  onFilterColumn(searchData: FloatingFilterSearchData): void {
    this.store.dispatch(new SurveyInvitationColumnSearch(searchData));
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
    this.store.dispatch(new UpdateSurveyInvitationGlobalSearch(event));
  }

  onSearch(): void {
    this.onPageChange(1);
  }

  onPageChange(page: number): void {
    this.store.dispatch(new SetSurveyInvitationCurrentPage(page));
    this.loadSurvey();
  }

  onPerPageChange(perPage: number): void {
    this.store.dispatch(new UpdateSurveyInvitationPerPage(perPage));
    this.loadSurvey();
  }

  loadSurvey(): void {
    this.gridReadyEvent.api.showLoadingOverlay();
    const observer = this.surveyInvitationService.getSurvey().subscribe(
      (response: SurveyInvitationList) => {
        this.pagination = response.pagination;
        this.surveyInvitation = response.survey_form_invitations;
        this.gridReadyEvent.api.hideOverlay();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
        this.gridReadyEvent.api.hideOverlay();
      }
    );
    this.subscriptions.add(observer);
  }

  onResend(params: ICellRendererParams): void {
    const observer = this.surveyInvitationService.resendInvitation(params.data.id).subscribe(
      (response: MessageResponse) => {
        this.toasterService.success(response.message);
        this.loadSurvey();
      },
      (error: ErrorResponse) => {
        this.toasterService.error(error.message);
      }
    );
    this.subscriptions.add(observer);
  }
}
