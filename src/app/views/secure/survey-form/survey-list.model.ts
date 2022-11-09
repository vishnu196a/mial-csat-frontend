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

export type SurveyInvitationForm = Omit<
  SurveyForm,
  'id' | 'is_active' | 'updated_by_id' | 'updated_by_name'
> & { survey_form_invitation_id: number; survey_form_id: number; questions: DynamicQuestions[] };

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
