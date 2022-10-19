import { SurveyInvitationState } from '../survey-invitation-list.model';
import {
  SurveyInvitationActions,
  SurveyInvitationActionTypes,
} from './survey-invitation-list.actions';

const initialState: SurveyInvitationState = {
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
    type: '',
    contact: '',
    call_id: '',
    survey_form_name: '',
    resent_by_name: '',
  },
};

export function surveyInvitationReducer(
  state = initialState,
  action: SurveyInvitationActions
): SurveyInvitationState {
  switch (action.type) {
    case SurveyInvitationActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case SurveyInvitationActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case SurveyInvitationActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case SurveyInvitationActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case SurveyInvitationActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
