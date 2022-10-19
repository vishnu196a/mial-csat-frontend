import { CallsState } from '@secure/abandoned-calls/abandoned-calls.model';
import { CallBackActions, CallBackActionTypes } from './callback-calls.actions';

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
    from: '',
    to: '',
  },
};

export function callBackReducer(state = initialState, action: CallBackActions): CallsState {
  switch (action.type) {
    case CallBackActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case CallBackActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case CallBackActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case CallBackActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case CallBackActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
