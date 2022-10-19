import { CategoryReportsState } from '../category-reports-list.model';
import {
  CategoryReportsActions,
  CategoryReportsActionTypes,
} from './category-reports-list.actions';

const initialState: CategoryReportsState = {
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
    count: 0,
  },
};

export function CategoryReportsReducer(
  state = initialState,
  action: CategoryReportsActions
): CategoryReportsState {
  switch (action.type) {
    case CategoryReportsActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case CategoryReportsActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case CategoryReportsActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case CategoryReportsActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case CategoryReportsActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
