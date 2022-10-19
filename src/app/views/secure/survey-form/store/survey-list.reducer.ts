import { SurveyState } from '../survey-list.model';
import { SurveyActions, SurveyActionTypes } from './survey-list.actions';

const initialState: SurveyState = {
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
    created_by_name: '',
    updated_by_name: '',
  },
};

export function surveyReducer(state = initialState, action: SurveyActions): SurveyState {
  switch (action.type) {
    case SurveyActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case SurveyActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case SurveyActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case SurveyActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case SurveyActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
