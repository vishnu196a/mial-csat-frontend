import { TerminalInfoState } from '../terminal-info.model';
import { TerminalInfoActionTypes, TerminalInfoActions } from './terminal-info.actions';

const initialState: TerminalInfoState = {
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
    terminal_name: '',
    location: '',
    category: '',
    shop_name: '',
    description: '',
    phone: '',
    email: '',
  },
};

export function terminalInfoReducer(
  state = initialState,
  action: TerminalInfoActions
): TerminalInfoState {
  switch (action.type) {
    case TerminalInfoActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case TerminalInfoActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case TerminalInfoActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case TerminalInfoActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case TerminalInfoActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
