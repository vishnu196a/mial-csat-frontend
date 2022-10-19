import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum TerminalInfoActionTypes {
  SET_PAGINATION = '[TERMINAL_INFO] pagination',
  SET_CURRENT_PAGE = '[TERMINAL_INFO] current page',
  SET_PER_PAGE = '[TERMINAL_INFO] set per page',
  SET_GLOBAL_SEARCH = '[TERMINAL_INFO] set global search',
  SET_COLUMN_SEARCH = '[TERMINAL_INFO] set column search',
}

export class SetTerminalInfoPagination implements Action {
  readonly type = TerminalInfoActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetTerminalInfoCurrentPage implements Action {
  readonly type = TerminalInfoActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateTerminalInfoPerPage implements Action {
  readonly type = TerminalInfoActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateTerminalInfoGlobalSearch implements Action {
  readonly type = TerminalInfoActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class TerminalInfoColumnSearch implements Action {
  readonly type = TerminalInfoActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}

export type TerminalInfoActions =
  | SetTerminalInfoPagination
  | SetTerminalInfoCurrentPage
  | UpdateTerminalInfoPerPage
  | TerminalInfoColumnSearch
  | UpdateTerminalInfoGlobalSearch;
