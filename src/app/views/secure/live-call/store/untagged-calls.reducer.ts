import { UntagCallState } from '../live-call.model';
import { UntaggedActionTypes, UntaggedActions } from './untagged-calls.actions';

const initialState: UntagCallState = {
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
};

export function untaggedCallsReducer(
  state = initialState,
  action: UntaggedActions
): UntagCallState {
  switch (action.type) {
    case UntaggedActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case UntaggedActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case UntaggedActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case UntaggedActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    default:
      return state;
  }
}
