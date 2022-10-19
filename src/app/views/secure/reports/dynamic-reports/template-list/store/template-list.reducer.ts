import { TemplateListState } from '@secure/reports/report-manager.model';
import { TemplateListActions, TemplateListActionTypes } from './template-list.actions';

const initialState: TemplateListState = {
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

export function templateListReducer(
  state = initialState,
  action: TemplateListActions
): TemplateListState {
  switch (action.type) {
    case TemplateListActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case TemplateListActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case TemplateListActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case TemplateListActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case TemplateListActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    case TemplateListActionTypes.CLEAR_PAGINATION:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
