import { ActionReducerMap } from '@ngrx/store';
import { AuthenticationState } from '@public/authentication/authentication.model';
import { authenticationReducer } from '@public/authentication/store/authentication.reducer';

export interface AppState {
  authenticationState: AuthenticationState;
}

export const appReducers: ActionReducerMap<AppState> = {
  authenticationState: authenticationReducer,
};
