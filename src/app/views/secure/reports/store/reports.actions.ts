import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum ReportsActionTypes {
  SET_PAGINATION = '[REPORTS] pagination',
  SET_CURRENT_PAGE = '[REPORTS] current page',
  SET_PER_PAGE = '[REPORTS] set per page',
  SET_GLOBAL_SEARCH = '[REPORTS] set global search',
  SET_COLUMN_SEARCH = '[REPORTS] set column search',
}

export class SetReportsPagination implements Action {
  readonly type = ReportsActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetReportsCurrentPage implements Action {
  readonly type = ReportsActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateReportsPerPage implements Action {
  readonly type = ReportsActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateReportsGlobalSearch implements Action {
  readonly type = ReportsActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class ReportsColumnSearch implements Action {
  readonly type = ReportsActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type ReportsActions =
  | SetReportsPagination
  | SetReportsCurrentPage
  | UpdateReportsPerPage
  | UpdateReportsGlobalSearch
  | ReportsColumnSearch;
