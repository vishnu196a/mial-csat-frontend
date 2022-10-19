import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TemplateListState } from '@secure/reports/report-manager.model';

export const templateListState = createFeatureSelector<TemplateListState>('templateListState');

export const GetTemplateListGlobalSearch = createSelector(
  templateListState,
  (state: TemplateListState): string => state.globalSearch
);
