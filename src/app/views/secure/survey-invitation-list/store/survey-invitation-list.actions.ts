import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum SurveyInvitationActionTypes {
  SET_PAGINATION = '[SurveyInvitation] pagination',
  SET_CURRENT_PAGE = '[SurveyInvitation] current page',
  SET_PER_PAGE = '[SurveyInvitation] set per page',
  SET_GLOBAL_SEARCH = '[SurveyInvitation] set global search',
  SET_COLUMN_SEARCH = '[SurveyInvitation] set column search',
}

export class SetSurveyInvitationPagination implements Action {
  readonly type = SurveyInvitationActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetSurveyInvitationCurrentPage implements Action {
  readonly type = SurveyInvitationActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSurveyInvitationPerPage implements Action {
  readonly type = SurveyInvitationActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSurveyInvitationGlobalSearch implements Action {
  readonly type = SurveyInvitationActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class SurveyInvitationColumnSearch implements Action {
  readonly type = SurveyInvitationActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type SurveyInvitationActions =
  | SetSurveyInvitationPagination
  | SetSurveyInvitationCurrentPage
  | UpdateSurveyInvitationPerPage
  | SurveyInvitationColumnSearch
  | UpdateSurveyInvitationGlobalSearch;
