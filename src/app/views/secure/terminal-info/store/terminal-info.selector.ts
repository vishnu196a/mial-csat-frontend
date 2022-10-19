import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TerminalInfoState } from '../terminal-info.model';

export const terminalInfoState = createFeatureSelector<TerminalInfoState>('terminalInfoState');

export const GetTerminalInfoGlobalSearch = createSelector(
  terminalInfoState,
  (state: TerminalInfoState): string => state.globalSearch
);
