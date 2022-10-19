import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface SurveyForm {
  id: number;
  name: string;
  is_active: boolean | string;
  created_at: string;
  updated_at: string;
  created_by_id: number;
  updated_by_id: number;
  created_by_name: string;
  updated_by_name: string;
}

export interface QuestionResponseForm {
  type: string;
  answer: string;
  question: string;
}
export interface SurveyResponseForm {
  responses: QuestionResponseForm[];
  survey_form_id: number;
  survey_form_invitation_id: number;
}
export type SurveyResponse = Pick<SurveyForm, 'id' | 'created_at' | 'updated_at'> &
  SurveyResponseForm;

export type SurveyResponseView = { survey_form_name: 'string' } & SurveyResponse;

export type SurveyInvitationForm = Omit<
  SurveyForm,
  'id' | 'is_active' | 'updated_by_id' | 'updated_by_name'
> & { survey_form_invitation_id: number; survey_form_id: number; questions: DynamicQuestions[] };

export type SurveyFormDetails = Pick<
  SurveyForm,
  'id' | 'name' | 'is_active' | 'created_at' | 'updated_at'
> & { questions: DynamicQuestions[] };

export class SurveyList {
  survey_forms: SurveyForm[];
  pagination: Pagination;
}

export interface SurveyState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface Questions {
  id?: number;
  question: string;
  type: string;
  option: string[];
  ratings: string;
  multi_select?: string[];
  isVisible?: boolean;
  rate?: number | null;
}

export type DynamicQuestions = Questions & {
  dependent_questions?: Questions[];
};
export interface AddSurveyForm {
  name: string;
  questions: DynamicQuestions[];
}

export interface SurveyReport {
  user_id: number;
  user_name: string;
  total_score: number;
  no_of_feedback: number;
  survey_form_id: number;
  survey_form_name: string;
  score_percentage: number;
}

export interface SurveyReportList {
  pagination: Pagination;
  survey_form_reports: SurveyReport[];
}
