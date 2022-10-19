import { SubCategoryReportsState } from '../sub-category-reports-list.model';
import {
  SubCategoryReportsActions,
  SubCategoryReportsActionTypes,
} from './sub-category-reports-list.actions';

const initialState: SubCategoryReportsState = {
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

export function SubCategoryReportsReducer(
  state = initialState,
  action: SubCategoryReportsActions
): SubCategoryReportsState {
  switch (action.type) {
    case SubCategoryReportsActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case SubCategoryReportsActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case SubCategoryReportsActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case SubCategoryReportsActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case SubCategoryReportsActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
