import { UserState } from '../user.model';
import { UserActions, UserActionTypes } from './user.actions';

const initialState: UserState = {
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
    name: '',
    employee_number: '',
    mobile_no: '',
    email_id: '',
    agent_code: '',
    role: '',
  },
};

export function userReducer(state = initialState, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case UserActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case UserActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case UserActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case UserActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
