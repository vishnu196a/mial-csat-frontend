import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum CmsActionTypes {
  SET_PAGINATION = '[CMS] pagination',
  SET_CURRENT_PAGE = '[CMS] current page',
  SET_PER_PAGE = '[CMS] set per page',
  SET_GLOBAL_SEARCH = '[CMS] set global search',
  SET_COLUMN_SEARCH = '[CMS] set column search',
}

export class SetCmsPagination implements Action {
  readonly type = CmsActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetCmsCurrentPage implements Action {
  readonly type = CmsActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCmsPerPage implements Action {
  readonly type = CmsActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCmsGlobalSearch implements Action {
  readonly type = CmsActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class CmsColumnSearch implements Action {
  readonly type = CmsActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export type CmsActions =
  | SetCmsPagination
  | SetCmsCurrentPage
  | UpdateCmsPerPage
  | CmsColumnSearch
  | UpdateCmsGlobalSearch;
