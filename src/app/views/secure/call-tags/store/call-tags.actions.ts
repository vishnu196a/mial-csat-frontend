import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum CallTagsActionTypes {
  SET_PAGINATION = '[CALLTAGS] pagination',
  SET_CURRENT_PAGE = '[CALLTAGS] current page',
  SET_PER_PAGE = '[CALLTAGS] set per page',
  SET_GLOBAL_SEARCH = '[CALLTAGS] set global search',
  SET_COLUMN_SEARCH = '[CALLTAGS] set column search',
  CLEAR_PAGINATION = '[FLIGHT_STATUS] clear pagination',
}

export class SetCallTagsPagination implements Action {
  readonly type = CallTagsActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetCallTagsCurrentPage implements Action {
  readonly type = CallTagsActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCallTagsPerPage implements Action {
  readonly type = CallTagsActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCallTagsGlobalSearch implements Action {
  readonly type = CallTagsActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class CallTagsColumnSearch implements Action {
  readonly type = CallTagsActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export class CallTagsClearPagination implements Action {
  readonly type = CallTagsActionTypes.CLEAR_PAGINATION;
  constructor() {}
}
export type callTagsActions =
  | SetCallTagsPagination
  | SetCallTagsCurrentPage
  | UpdateCallTagsPerPage
  | CallTagsColumnSearch
  | CallTagsClearPagination
  | UpdateCallTagsGlobalSearch;
