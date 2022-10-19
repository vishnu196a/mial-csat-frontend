import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SurveyFormResponseState } from '../survey-form-response.model';

export const surveyformresponseState =
  createFeatureSelector<SurveyFormResponseState>('surveyFormResponseState');

export const GetSurveyFormResponseGlobalSearch = createSelector(
  surveyformresponseState,
  (state: SurveyFormResponseState): string => state.globalSearch
);
