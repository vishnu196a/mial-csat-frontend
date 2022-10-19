import { CategoryState } from '../category.model';
import { CategoryActions, CategoryActionTypes } from './category.actions';

const initialState: CategoryState = {
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

export function categoryReducer(state = initialState, action: CategoryActions): CategoryState {
  switch (action.type) {
    case CategoryActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case CategoryActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case CategoryActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case CategoryActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    default:
      return state;
  }
}
