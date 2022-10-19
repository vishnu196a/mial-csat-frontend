import { CallsState } from '@secure/abandoned-calls/abandoned-calls.model';
import { CalledBackActions, CalledBackActionTypes } from './calledback-calls.actions';

const initialState: CallsState = {
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
    contact_number: '',
    type_of_called_back_queue: '',
    from: '',
    to: '',
  },
};

export function calledBackReducer(state = initialState, action: CalledBackActions): CallsState {
  switch (action.type) {
    case CalledBackActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case CalledBackActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case CalledBackActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case CalledBackActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case CalledBackActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
