import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum CategoryReportsActionTypes {
  SET_PAGINATION = '[CategoryReports] pagination',
  SET_CURRENT_PAGE = '[CategoryReports] current page',
  SET_PER_PAGE = '[CategoryReports] set per page',
  SET_GLOBAL_SEARCH = '[CategoryReports] set global search',
  SET_COLUMN_SEARCH = '[CategoryReports] set column search',
}

export class SetCategoryReportsPagination implements Action {
  readonly type = CategoryReportsActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetCategoryReportsCurrentPage implements Action {
  readonly type = CategoryReportsActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCategoryReportsPerPage implements Action {
  readonly type = CategoryReportsActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCategoryReportsGlobalSearch implements Action {
  readonly type = CategoryReportsActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class CategoryReportsColumnSearch implements Action {
  readonly type = CategoryReportsActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type CategoryReportsActions =
  | SetCategoryReportsPagination
  | SetCategoryReportsCurrentPage
  | UpdateCategoryReportsPerPage
  | CategoryReportsColumnSearch
  | UpdateCategoryReportsGlobalSearch;
