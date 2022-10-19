import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum SurveyActionTypes {
  SET_PAGINATION = '[Survey] pagination',
  SET_CURRENT_PAGE = '[Survey] current page',
  SET_PER_PAGE = '[Survey] set per page',
  SET_GLOBAL_SEARCH = '[Survey] set global search',
  SET_COLUMN_SEARCH = '[Survey] set column search',
}

export class SetSurveyPagination implements Action {
  readonly type = SurveyActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetSurveyCurrentPage implements Action {
  readonly type = SurveyActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSurveyPerPage implements Action {
  readonly type = SurveyActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSurveyGlobalSearch implements Action {
  readonly type = SurveyActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class SurveyColumnSearch implements Action {
  readonly type = SurveyActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type SurveyActions =
  | SetSurveyPagination
  | SetSurveyCurrentPage
  | UpdateSurveyPerPage
  | SurveyColumnSearch
  | UpdateSurveyGlobalSearch;
