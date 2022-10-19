import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CallsState } from '../abandoned-calls.model';

export const abandonedCallsState = createFeatureSelector<CallsState>('abandonedCallsState');

export const GetAbadonedCallsGlobalSearch = createSelector(
  abandonedCallsState,
  (state: CallsState): string => state.globalSearch
);

export const GetCallsState = createSelector(
  abandonedCallsState,
  (state: CallsState): CallsState => state
);
