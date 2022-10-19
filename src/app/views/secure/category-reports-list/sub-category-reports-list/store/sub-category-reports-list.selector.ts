import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubCategoryReportsState } from '../sub-category-reports-list.model';

export const subCategoryReportsState =
  createFeatureSelector<SubCategoryReportsState>('subCategoryReportsState');

export const GetSubCategoryReportsGlobalSearch = createSelector(
  subCategoryReportsState,
  (state: SubCategoryReportsState): string => state.globalSearch
);
