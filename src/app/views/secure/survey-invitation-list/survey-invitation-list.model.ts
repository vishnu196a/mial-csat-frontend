import { FloatingFilterSearchData } from '@shared/models/shared.model';
import { Pagination } from '@shared/models/shared.model';

export interface SurveyFormInvitation {
  id: number;
  survey_form_id: number;
  survey_form_name: string;
  call_id: number;
  type: string;
  status: string;
  contact: string;
  invitation_url: string;
  resent_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyInvitationList {
  survey_form_invitations: SurveyFormInvitation[];
  pagination: Pagination;
}

export interface SurveyInvitationState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}
