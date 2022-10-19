import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from '../category.model';

export const categoryState = createFeatureSelector<CategoryState>('categoryState');

export const GetCategoryGlobalSearch = createSelector(
  categoryState,
  (state: CategoryState): string => state.globalSearch
);
