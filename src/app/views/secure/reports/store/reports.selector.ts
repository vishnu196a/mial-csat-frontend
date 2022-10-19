import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReportsState } from '../report-manager.model';

export const reportsState = createFeatureSelector<ReportsState>('reportsState');

export const GetReportsGlobalSearch = createSelector(
  reportsState,
  (state: ReportsState): string => state.globalSearch
);
