import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FlightStatusState } from '../flight-status.model';

export const flightStatusState = createFeatureSelector<FlightStatusState>('flightStatusState');

export const GetFlightStatusGlobalSearch = createSelector(
  flightStatusState,
  (state: FlightStatusState): string => state.globalSearch
);

export const GetFlightStatusState = createSelector(
  flightStatusState,
  (state: FlightStatusState): FlightStatusState => state
);
