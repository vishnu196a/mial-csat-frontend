import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum CallBackActionTypes {
  SET_PAGINATION = '[CallBack] pagination',
  SET_CURRENT_PAGE = '[CallBack] current page',
  SET_PER_PAGE = '[CallBack] set per page',
  SET_GLOBAL_SEARCH = '[CallBack] set global search',
  SET_COLUMN_SEARCH = '[CallBack] set column search',
}

export class SetCallBackPagination implements Action {
  readonly type = CallBackActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetCallBackCurrentPage implements Action {
  readonly type = CallBackActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCallBackPerPage implements Action {
  readonly type = CallBackActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCallBackGlobalSearch implements Action {
  readonly type = CallBackActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class CallBackColumnSearch implements Action {
  readonly type = CallBackActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type CallBackActions =
  | SetCallBackPagination
  | SetCallBackCurrentPage
  | UpdateCallBackPerPage
  | CallBackColumnSearch
  | UpdateCallBackGlobalSearch;
