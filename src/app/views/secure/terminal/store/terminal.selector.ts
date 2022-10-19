import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TerminalState } from '../terminal.model';

export const terminalState = createFeatureSelector<TerminalState>('terminalState');

export const GetTerminalGlobalSearch = createSelector(
  terminalState,
  (state: TerminalState): string => state.globalSearch
);
