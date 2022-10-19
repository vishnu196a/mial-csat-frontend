import moment from 'moment';
import { FlightStatusState } from '../flight-status.model';
import { FlightStatusActions, FlightStatusActionTypes } from './flight-status.actions';

const initialState: FlightStatusState = {
  pagination: {
    current_page: 1,
    end_at: null,
    is_first_page: null,
    is_last_page: null,
    next_page: null,
    per_page: 10,
    prev_page: null,
    start_at: null,
    total_count: null,
    total_pages: null,
  },
  globalSearch: '',
  columns: {
    flight_number: '',
    updated_dt: '',
    airline_code: '',
    operational_status: '',
    departure_airport: '',
    arrival_airport: '',
    estimated_arrival_time: '',
    scheduled_arrival_time: '',
    scheduled_departure_time: '',
    estimated_departure_time: '',
    flight_type: 'domestic',
    schedule_type: 'arrival',
    from: moment().format('yyyy-MM-DD'),
    to: moment().add(1, 'days').format('yyyy-MM-DD'),
    flight_name: '',
    departure_airport_name: '',
    arrival_airport_name: '',
  },
};

export function flightStatusReducer(
  state = initialState,
  action: FlightStatusActions
): FlightStatusState {
  switch (action.type) {
    case FlightStatusActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case FlightStatusActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case FlightStatusActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case FlightStatusActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case FlightStatusActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    case FlightStatusActionTypes.CLEAR_PAGINATION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
