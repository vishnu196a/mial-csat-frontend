import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum SurveyFormResponseActionTypes {
  SET_PAGINATION = '[SURVEYFORMRESPONSE] pagination',
  SET_CURRENT_PAGE = '[SURVEYFORMRESPONSE] current page',
  SET_PER_PAGE = '[SURVEYFORMRESPONSE] set per page',
  SET_GLOBAL_SEARCH = '[SURVEYFORMRESPONSE] set global search',
  SET_COLUMN_SEARCH = '[SURVEYFORMRESPONSE] set column search',
}

export class SetSurveyFormResponsePagination implements Action {
  readonly type = SurveyFormResponseActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetSurveyFormResponseCurrentPage implements Action {
  readonly type = SurveyFormResponseActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSurveyFormResponsePerPage implements Action {
  readonly type = SurveyFormResponseActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSurveyFormResponseGlobalSearch implements Action {
  readonly type = SurveyFormResponseActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class SurveyFormResponseColumnSearch implements Action {
  readonly type = SurveyFormResponseActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type SurveyFormResponseActions =
  | SetSurveyFormResponsePagination
  | SetSurveyFormResponseCurrentPage
  | UpdateSurveyFormResponsePerPage
  | SurveyFormResponseColumnSearch
  | UpdateSurveyFormResponseGlobalSearch;
