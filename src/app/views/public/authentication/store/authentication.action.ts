import { Action } from '@ngrx/store';
import { AuthenticationState, UpdatedUserDetail } from '../authentication.model';

export enum AuthenticationActionTypes {
  SET_USER = '[Authentication] Set User',
  UPDATE_USER = '[Authentication] Update User',
  SIGN_OUT = '[Authentication] Sign Out',
}

export class SetUser implements Action {
  readonly type = AuthenticationActionTypes.SET_USER;
  constructor(public payload: AuthenticationState) {}
}

export class UpdateUser implements Action {
  readonly type = AuthenticationActionTypes.UPDATE_USER;
  constructor(public payload: UpdatedUserDetail) {}
}

export class SignOut implements Action {
  readonly type = AuthenticationActionTypes.SIGN_OUT;
}

export type AuthenticationAction = SetUser | SignOut | UpdateUser;
