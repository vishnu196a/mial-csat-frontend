import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubCategoryState } from '../sub-category.model';

export const categoryState = createFeatureSelector<SubCategoryState>('subCategoryState');

export const GetUserGlobalSearch = createSelector(
  categoryState,
  (state: SubCategoryState): string => state.globalSearch
);
