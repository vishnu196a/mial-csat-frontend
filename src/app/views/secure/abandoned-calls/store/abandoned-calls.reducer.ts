import { CallsState } from '../abandoned-calls.model';
import { AbandonedCallsActions, AbandonedCallsActionTypes } from './abandoned-calls.actions';

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

export function abandonedCallsReducer(
  state = initialState,
  action: AbandonedCallsActions
): CallsState {
  switch (action.type) {
    case AbandonedCallsActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case AbandonedCallsActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case AbandonedCallsActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case AbandonedCallsActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case AbandonedCallsActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
