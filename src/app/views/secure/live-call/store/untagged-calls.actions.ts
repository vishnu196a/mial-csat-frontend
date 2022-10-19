import { Action } from '@ngrx/store';
import { Pagination } from '@shared/models/shared.model';

export enum UntaggedActionTypes {
  SET_PAGINATION = '[UNTAGGED] pagination',
  SET_CURRENT_PAGE = '[UNTAGGED] current page',
  SET_PER_PAGE = '[UNTAGGED] set per page',
  SET_GLOBAL_SEARCH = '[UNTAGGED] set global search',
}

export class SetUntaggedPagination implements Action {
  readonly type = UntaggedActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetUntaggedCurrentPage implements Action {
  readonly type = UntaggedActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateUntaggedPerPage implements Action {
  readonly type = UntaggedActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateUntaggedGlobalSearch implements Action {
  readonly type = UntaggedActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}

export type UntaggedActions =
  | SetUntaggedPagination
  | SetUntaggedCurrentPage
  | UpdateUntaggedPerPage
  | UpdateUntaggedGlobalSearch;
