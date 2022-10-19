import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum UserActionTypes {
  SET_PAGINATION = '[USER] pagination',
  SET_CURRENT_PAGE = '[USER] current page',
  SET_PER_PAGE = '[USER] set per page',
  SET_GLOBAL_SEARCH = '[USER] set global search',
  SET_COLUMN_SEARCH = '[USER] set column search',
}

export class SetUserPagination implements Action {
  readonly type = UserActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetUserCurrentPage implements Action {
  readonly type = UserActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateUserPerPage implements Action {
  readonly type = UserActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateUserGlobalSearch implements Action {
  readonly type = UserActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class UserColumnSearch implements Action {
  readonly type = UserActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type UserActions =
  | SetUserPagination
  | SetUserCurrentPage
  | UpdateUserPerPage
  | UserColumnSearch
  | UpdateUserGlobalSearch;
