import { TerminalState } from '../terminal.model';
import { TerminalActions, TerminalActionTypes } from './terminal.actions';

const initialState: TerminalState = {
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
  },
};

export function terminalReducer(state = initialState, action: TerminalActions): TerminalState {
  switch (action.type) {
    case TerminalActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case TerminalActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case TerminalActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case TerminalActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case TerminalActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
