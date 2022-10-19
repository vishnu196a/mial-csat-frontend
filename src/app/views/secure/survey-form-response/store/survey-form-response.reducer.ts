import { SurveyFormResponseState } from '../survey-form-response.model';
import {
  SurveyFormResponseActions,
  SurveyFormResponseActionTypes,
} from './survey-form-response.actions';

const initialState: SurveyFormResponseState = {
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
    survey_form_name: '',
    user_name: '',
  },
};

export function surveyFormResponseReducer(
  state = initialState,
  action: SurveyFormResponseActions
): SurveyFormResponseState {
  switch (action.type) {
    case SurveyFormResponseActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case SurveyFormResponseActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case SurveyFormResponseActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case SurveyFormResponseActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case SurveyFormResponseActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
