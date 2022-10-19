import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryReportsState } from '../category-reports-list.model';

export const categoryReportsState =
  createFeatureSelector<CategoryReportsState>('categoryReportsState');

export const GetCategoryReportsGlobalSearch = createSelector(
  categoryReportsState,
  (state: CategoryReportsState): string => state.globalSearch
);
