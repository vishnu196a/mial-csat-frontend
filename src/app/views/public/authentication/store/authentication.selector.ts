import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  AuthenticationState,
  UserDetail,
  UserNameAndRole,
  UserRoleAndToken,
} from '../authentication.model';

const authenticationState = createFeatureSelector<AuthenticationState>('authenticationState');

export const getToken = createSelector(
  authenticationState,
  (state: AuthenticationState) => state.token
);

export const getUserDetails = createSelector(authenticationState, (state: AuthenticationState) => {
  const userDetails: UserDetail = {
    name: state.name,
    email: state.email,
    role: state.role,
    id: state.id,
    agent_code: state.agent_code,
    employee_number: state.employee_number,
    confirmed_at: state.confirmed_at,
    sign_in_count: state.sign_in_count,
    last_sign_in_at: state.last_sign_in_at,
    current_sign_in_at: state.current_sign_in_at,
  };
  return userDetails;
});

export const getUserNameAndRole = createSelector(
  authenticationState,
  (state: AuthenticationState) => {
    const userDetails: UserNameAndRole = {
      name: state.name,
      role: state.role,
    };
    return userDetails;
  }
);

export const getUserRoleAndToken = createSelector(
  authenticationState,
  (state: AuthenticationState) => {
    const userDetails: UserRoleAndToken = {
      token: state.token,
      role: state.role,
    };
    return userDetails;
  }
);

export const getUserRole = createSelector(authenticationState, (state: AuthenticationState) => {
  return state.role;
});
