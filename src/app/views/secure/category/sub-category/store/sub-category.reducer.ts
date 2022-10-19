import { SubCategoryState } from '../sub-category.model';
import { SubCategoryActions, SubCategoryActionTypes } from './sub-category.actions';

const initialState: SubCategoryState = {
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

export function subCategoryReducer(
  state = initialState,
  action: SubCategoryActions
): SubCategoryState {
  switch (action.type) {
    case SubCategoryActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case SubCategoryActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case SubCategoryActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case SubCategoryActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    default:
      return state;
  }
}
