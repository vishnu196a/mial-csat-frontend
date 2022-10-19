import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CmsState } from '../cms.model';

export const cmsState = createFeatureSelector<CmsState>('cmsState');

export const GetUserGlobalSearch = createSelector(
  cmsState,
  (state: CmsState): string => state.globalSearch
);
