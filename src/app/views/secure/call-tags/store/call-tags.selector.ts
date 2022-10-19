import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CallTagsState } from '../call-tags.model';

export const callTagsState = createFeatureSelector<CallTagsState>('callTagsState');

export const GetCallTagsGlobalSearch = createSelector(
  callTagsState,
  (state: CallTagsState): string => state.globalSearch
);
export const GetCallTagState = createSelector(
  callTagsState,
  (state: CallTagsState): CallTagsState => state
);
