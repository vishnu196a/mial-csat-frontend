import { Action } from '@ngrx/store';
import { Pagination } from '@shared/models/shared.model';

export enum SubCategoryActionTypes {
  SET_PAGINATION = '[SUB_CATEGORY] pagination',
  SET_CURRENT_PAGE = '[SUB_CATEGORY] current page',
  SET_PER_PAGE = '[SUB_CATEGORY] set per page',
  SET_GLOBAL_SEARCH = '[SUB_CATEGORY] set global search',
}

export class SetSubCategoryPagination implements Action {
  readonly type = SubCategoryActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetSubCategoryCurrentPage implements Action {
  readonly type = SubCategoryActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSubCategoryPerPage implements Action {
  readonly type = SubCategoryActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateSubCategoryGlobalSearch implements Action {
  readonly type = SubCategoryActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}

export type SubCategoryActions =
  | SetSubCategoryPagination
  | SetSubCategoryCurrentPage
  | UpdateSubCategoryPerPage
  | UpdateSubCategoryGlobalSearch;
