import { AuthenticationAction, AuthenticationActionTypes } from './authentication.action';
import { AuthenticationState } from '../authentication.model';

const initialState: AuthenticationState = {
  name: null,
  email: null,
  role: null,
  token: null,
  id: 0,
  agent_code: '',
  employee_number: '',
  confirmed_at: '',
  sign_in_count: 0,
  last_sign_in_at: '',
  current_sign_in_at: '',
};

export function authenticationReducer(
  state = initialState,
  action: AuthenticationAction
): AuthenticationState {
  switch (action.type) {
    case AuthenticationActionTypes.SET_USER:
      return {
        ...state,
        ...action.payload,
      };
    case AuthenticationActionTypes.UPDATE_USER:
      return {
        ...state,
        ...action.payload,
      };
    case AuthenticationActionTypes.SIGN_OUT:
      return initialState;
    default:
      return state;
  }
}
