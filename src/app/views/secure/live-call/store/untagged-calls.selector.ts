import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UntagCallState } from '../live-call.model';

export const untaggedCallsState = createFeatureSelector<UntagCallState>('untaggedCallsState');

export const GetUntaggedCallsGlobalSearch = createSelector(
  untaggedCallsState,
  (state: UntagCallState): string => state.globalSearch
);
