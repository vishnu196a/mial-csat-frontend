import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum SubCategoryReportsActionTypes {
  SET_PAGINATION = '[SubCategoryReports] pagination',
  SET_CURRENT_PAGE = '[SubCategoryReports] current page',
  SET_PER_PAGE = '[SubCategoryReports] set per page',
  SET_GLOBAL_SEARCH = '[SubCategoryReports] set global search',
  SET_COLUMN_SEARCH = '[SubCategoryReports] set column search',
}

export class SetSubCategoryReportsPagination implements Action {
  readonly type = SubCategoryReportsActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetSubCategoryReportsCurrentPage implements Action {
  readonly type = SubCategoryReportsActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSubCategoryReportsPerPage implements Action {
  readonly type = SubCategoryReportsActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSubCategoryReportsGlobalSearch implements Action {
  readonly type = SubCategoryReportsActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class SubCategoryReportsColumnSearch implements Action {
  readonly type = SubCategoryReportsActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type SubCategoryReportsActions =
  | SetSubCategoryReportsPagination
  | SetSubCategoryReportsCurrentPage
  | UpdateSubCategoryReportsPerPage
  | SubCategoryReportsColumnSearch
  | UpdateSubCategoryReportsGlobalSearch;
