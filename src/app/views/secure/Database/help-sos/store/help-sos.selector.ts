import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SosState } from '../../cms.model';

export const sosState = createFeatureSelector<SosState>('sosState');

export const GetSosGlobalSearch = createSelector(
  sosState,
  (state: SosState): string => state.globalSearch
);
