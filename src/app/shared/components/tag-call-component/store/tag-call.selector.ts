import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TagCallState } from '@secure/live-call/live-call.model';

export const tagCallsState = createFeatureSelector<TagCallState>('tagCallState');

export const GetTagCallState = createSelector(
  tagCallsState,
  (state: TagCallState): TagCallState => state
);
