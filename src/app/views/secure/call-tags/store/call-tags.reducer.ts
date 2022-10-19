import { CallTagsState } from '../call-tags.model';
import { callTagsActions, CallTagsActionTypes } from './call-tags.actions';

const initialState: CallTagsState = {
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
    category_name: '',
    created_by_name: '',
    sub_category_name: '',
    from: '',
    to: '',
  },
};

export function callTagsReducer(state = initialState, action: callTagsActions): CallTagsState {
  switch (action.type) {
    case CallTagsActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case CallTagsActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case CallTagsActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case CallTagsActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case CallTagsActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    case CallTagsActionTypes.CLEAR_PAGINATION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
