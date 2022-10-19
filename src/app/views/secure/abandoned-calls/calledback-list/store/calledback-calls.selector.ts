import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CallsState } from '@secure/abandoned-calls/abandoned-calls.model';

export const calledBackState = createFeatureSelector<CallsState>('calledBackState');

export const GetCalledBackGlobalSearch = createSelector(
  calledBackState,
  (state: CallsState): string => state.globalSearch
);

export const GetCallsState = createSelector(
  calledBackState,
  (state: CallsState): CallsState => state
);
