import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { AuthenticationActionTypes } from '@public/authentication/store/authentication.action';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AppState } from './app.reducer';

// Should be same as one of the key in interface AppState
const STORE_KEYS_TO_PERSIST = [
  'authenticationState',
  'userState',
  'categoryState',
  'subCategoryState',
  'flightStatusState',
  'cmsState',
  'sosState',
  'contactsState',
  'surveyFormResponseState',
  'surveyState',
  'callTagsState',
  'categoryReportsState',
  'subCategoryReportsState',
  'surveyInvitationState',
  'terminalState',
  'abandonedCallsState',
  'callBackState',
  'calledBackState',
  'terminalInfoState',
  'untaggedCallsState',
  'reportsState',
  'tagCallState',
  'templateListState',
];

function localStorageSyncReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return localStorageSync({ keys: STORE_KEYS_TO_PERSIST, rehydrate: true })(reducer);
}

function logOut(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state: AppState, action: Action) => {
    if (action.type === AuthenticationActionTypes.SIGN_OUT) {
      state = {} as AppState;
    }
    return reducer(state, action);
  };
}

export const metaReducers: Array<MetaReducer<AppState, Action>> = [localStorageSyncReducer, logOut];
