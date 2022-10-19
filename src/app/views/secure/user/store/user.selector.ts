import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../user.model';

export const userState = createFeatureSelector<UserState>('userState');

export const GetUserGlobalSearch = createSelector(
  userState,
  (state: UserState): string => state.globalSearch
);
