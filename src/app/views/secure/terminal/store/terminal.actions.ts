import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum TerminalActionTypes {
  SET_PAGINATION = '[TERMINAL] pagination',
  SET_CURRENT_PAGE = '[TERMINAL] current page',
  SET_PER_PAGE = '[TERMINAL] set per page',
  SET_GLOBAL_SEARCH = '[TERMINAL] set global search',
  SET_COLUMN_SEARCH = '[TERMINAL] set column search',
}

export class SetTerminalPagination implements Action {
  readonly type = TerminalActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetTerminalCurrentPage implements Action {
  readonly type = TerminalActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateTerminalPerPage implements Action {
  readonly type = TerminalActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateTerminalGlobalSearch implements Action {
  readonly type = TerminalActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class TerminalColumnSearch implements Action {
  readonly type = TerminalActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}

export type TerminalActions =
  | SetTerminalPagination
  | SetTerminalCurrentPage
  | UpdateTerminalPerPage
  | TerminalColumnSearch
  | UpdateTerminalGlobalSearch;
