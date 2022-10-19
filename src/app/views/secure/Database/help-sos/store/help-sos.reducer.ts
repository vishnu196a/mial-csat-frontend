import { SosState } from '../../cms.model';
import { SosActions, SosActionTypes } from './help-sos.actions';

const initialState: SosState = {
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
    title: '',
    category_name: '',
    created_by_name: '',
    sub_category_name: '',
  },
};

export function sosReducer(state = initialState, action: SosActions): SosState {
  switch (action.type) {
    case SosActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case SosActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case SosActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case SosActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case SosActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
