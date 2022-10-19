import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum ContactsActionTypes {
  SET_PAGINATION = '[CONTACTS] pagination',
  SET_CURRENT_PAGE = '[CONTACTS] current page',
  SET_PER_PAGE = '[CONTACTS] set per page',
  SET_GLOBAL_SEARCH = '[CONTACTS] set global search',
  SET_COLUMN_SEARCH = '[CONTACTS] set column search',
}

export class SetContactsPagination implements Action {
  readonly type = ContactsActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetContactsCurrentPage implements Action {
  readonly type = ContactsActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateContactsPerPage implements Action {
  readonly type = ContactsActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateContactsGlobalSearch implements Action {
  readonly type = ContactsActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class ContactsColumnSearch implements Action {
  readonly type = ContactsActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type ContactsActions =
  | SetContactsPagination
  | SetContactsCurrentPage
  | UpdateContactsPerPage
  | UpdateContactsGlobalSearch
  | ContactsColumnSearch;
