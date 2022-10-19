import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface SurveyFormResponse {
  id: number;
  created_at: string;
  updated_at: string;
  survey_form_id: number;
  survey_form_name: string;
  survey_form_invitation_id: number;
  score: number;
  user_id: number;
  user_name: string;
}

export interface SurveyFormResponseState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface SurveyFormResponseList {
  survey_form_responses: SurveyFormResponse[];
  pagination: Pagination;
}
