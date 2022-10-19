import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum SosActionTypes {
  SET_PAGINATION = '[SOS] pagination',
  SET_CURRENT_PAGE = '[SOS] current page',
  SET_PER_PAGE = '[SOS] set per page',
  SET_GLOBAL_SEARCH = '[SOS] set global search',
  SET_COLUMN_SEARCH = '[SOS] set column search',
}

export class SetSosPagination implements Action {
  readonly type = SosActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetSosCurrentPage implements Action {
  readonly type = SosActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSosPerPage implements Action {
  readonly type = SosActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSosGlobalSearch implements Action {
  readonly type = SosActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class SosColumnSearch implements Action {
  readonly type = SosActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type SosActions =
  | SetSosPagination
  | SetSosCurrentPage
  | UpdateSosPerPage
  | SosColumnSearch
  | UpdateSosGlobalSearch;
