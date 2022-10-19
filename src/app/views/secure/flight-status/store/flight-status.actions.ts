import { Action } from '@ngrx/store';
import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export enum FlightStatusActionTypes {
  SET_PAGINATION = '[FLIGHT_STATUS] pagination',
  SET_CURRENT_PAGE = '[FLIGHT_STATUS] current page',
  SET_PER_PAGE = '[FLIGHT_STATUS] set per page',
  SET_GLOBAL_SEARCH = '[FLIGHT_STATUS] set global search',
  SET_COLUMN_SEARCH = '[FLIGHT_STATUS] set column search',
  CLEAR_PAGINATION = '[FLIGHT_STATUS] clear pagination',
}

export class SetFlightStatusPagination implements Action {
  readonly type = FlightStatusActionTypes.SET_PAGINATION;
  constructor(public payload: Pagination) {}
}

export class SetFlightStatusCurrentPage implements Action {
  readonly type = FlightStatusActionTypes.SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class UpdateFlightStatusPerPage implements Action {
  readonly type = FlightStatusActionTypes.SET_PER_PAGE;
  constructor(public payload: number) {}
}

export class UpdateFlightStatusGlobalSearch implements Action {
  readonly type = FlightStatusActionTypes.SET_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}
export class FlightStatusColumnSearch implements Action {
  readonly type = FlightStatusActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export class FlightStatusClearPagination implements Action {
  readonly type = FlightStatusActionTypes.CLEAR_PAGINATION;
  constructor() {}
}
export type FlightStatusActions =
  | SetFlightStatusPagination
  | SetFlightStatusCurrentPage
  | UpdateFlightStatusPerPage
  | FlightStatusColumnSearch
  | FlightStatusClearPagination
  | UpdateFlightStatusGlobalSearch;
