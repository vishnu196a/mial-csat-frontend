import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum TemplateListActionTypes {
  SET_PAGINATION = '[TEMPLATE_LIST] pagination',
  SET_CURRENT_PAGE = '[TEMPLATE_LIST] current page',
  SET_PER_PAGE = '[TEMPLATE_LIST] set per page',
  SET_GLOBAL_SEARCH = '[TEMPLATE_LIST] set global search',
  SET_COLUMN_SEARCH = '[TEMPLATE_LIST] set column search',
  CLEAR_PAGINATION = '[TEMPLATE_LIST] clear pagination',
}

export class SetTemplateListPagination implements Action {
  readonly type = TemplateListActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetTemplateListCurrentPage implements Action {
  readonly type = TemplateListActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateTemplateListPerPage implements Action {
  readonly type = TemplateListActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateTemplateListGlobalSearch implements Action {
  readonly type = TemplateListActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class TemplateListColumnSearch implements Action {
  readonly type = TemplateListActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export class TemplateListClearPagination implements Action {
  readonly type = TemplateListActionTypes.CLEAR_PAGINATION;
  constructor() {}
}
export type TemplateListActions =
  | SetTemplateListPagination
  | SetTemplateListCurrentPage
  | UpdateTemplateListPerPage
  | TemplateListColumnSearch
  | TemplateListClearPagination
  | UpdateTemplateListGlobalSearch;
