import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum CalledBackActionTypes {
  SET_PAGINATION = '[CalledBack] pagination',
  SET_CURRENT_PAGE = '[CalledBack] current page',
  SET_PER_PAGE = '[CalledBack] set per page',
  SET_GLOBAL_SEARCH = '[CalledBack] set global search',
  SET_COLUMN_SEARCH = '[CalledBack] set column search',
}

export class SetCalledBackPagination implements Action {
  readonly type = CalledBackActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetCalledBackCurrentPage implements Action {
  readonly type = CalledBackActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCalledBackPerPage implements Action {
  readonly type = CalledBackActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCalledBackGlobalSearch implements Action {
  readonly type = CalledBackActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class CalledBackColumnSearch implements Action {
  readonly type = CalledBackActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type CalledBackActions =
  | SetCalledBackPagination
  | SetCalledBackCurrentPage
  | UpdateCalledBackPerPage
  | CalledBackColumnSearch
  | UpdateCalledBackGlobalSearch;
