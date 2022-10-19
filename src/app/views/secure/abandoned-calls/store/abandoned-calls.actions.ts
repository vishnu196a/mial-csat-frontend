import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum AbandonedCallsActionTypes {
  SET_PAGINATION = '[AbandonedCalls] pagination',
  SET_CURRENT_PAGE = '[AbandonedCalls] current page',
  SET_PER_PAGE = '[AbandonedCalls] set per page',
  SET_GLOBAL_SEARCH = '[AbandonedCalls] set global search',
  SET_COLUMN_SEARCH = '[AbandonedCalls] set column search',
}

export class SetAbandonedCallsPagination implements Action {
  readonly type = AbandonedCallsActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetAbandonedCallsCurrentPage implements Action {
  readonly type = AbandonedCallsActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateAbandonedCallsPerPage implements Action {
  readonly type = AbandonedCallsActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateAbandonedCallsGlobalSearch implements Action {
  readonly type = AbandonedCallsActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class AbandonedCallsColumnSearch implements Action {
  readonly type = AbandonedCallsActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type AbandonedCallsActions =
  | SetAbandonedCallsPagination
  | SetAbandonedCallsCurrentPage
  | UpdateAbandonedCallsPerPage
  | AbandonedCallsColumnSearch
  | UpdateAbandonedCallsGlobalSearch;
