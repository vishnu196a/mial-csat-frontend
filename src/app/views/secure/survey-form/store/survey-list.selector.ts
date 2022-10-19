import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SurveyState } from '../survey-list.model';

export const surveyState = createFeatureSelector<SurveyState>('surveyState');

export const GetSurveyGlobalSearch = createSelector(
  surveyState,
  (state: SurveyState): string => state.globalSearch
);
