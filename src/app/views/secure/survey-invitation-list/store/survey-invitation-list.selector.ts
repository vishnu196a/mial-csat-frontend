import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SurveyInvitationState } from '../survey-invitation-list.model';

export const surveyInvitationState =
  createFeatureSelector<SurveyInvitationState>('surveyInvitationState');

export const GetSurveyInvitationGlobalSearch = createSelector(
  surveyInvitationState,
  (state: SurveyInvitationState): string => state.globalSearch
);
