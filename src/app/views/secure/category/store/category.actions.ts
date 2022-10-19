import { Action } from '@ngrx/store';
import { Pagination } from '@shared/models/shared.model';

export enum CategoryActionTypes {
  SET_PAGINATION = '[CATEGORY] pagination',
  SET_CURRENT_PAGE = '[CATEGORY] current page',
  SET_PER_PAGE = '[CATEGORY] set per page',
  SET_GLOBAL_SEARCH = '[CATEGORY] set global search',
}

export class SetCategoryPagination implements Action {
  readonly type = CategoryActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetCategoryCurrentPage implements Action {
  readonly type = CategoryActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCategoryPerPage implements Action {
  readonly type = CategoryActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateCategoryGlobalSearch implements Action {
  readonly type = CategoryActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}

export type CategoryActions =
  | SetCategoryPagination
  | SetCategoryCurrentPage
  | UpdateCategoryPerPage
  | UpdateCategoryGlobalSearch;
