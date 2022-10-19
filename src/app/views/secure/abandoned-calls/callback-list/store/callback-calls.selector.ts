import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CallsState } from '@secure/abandoned-calls/abandoned-calls.model';

export const callBackState = createFeatureSelector<CallsState>('callBackState');

export const GetCallBackGlobalSearch = createSelector(
  callBackState,
  (state: CallsState): string => state.globalSearch
);

export const GetCallsState = createSelector(
  callBackState,
  (state: CallsState): CallsState => state
);
