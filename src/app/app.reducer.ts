import { ActionReducerMap } from '@ngrx/store';
import { AuthenticationState } from '@public/authentication/authentication.model';
import { authenticationReducer } from '@public/authentication/store/authentication.reducer';
import { CallTagsState } from '@secure/call-tags/call-tags.model';
import { callTagsReducer } from '@secure/call-tags/store/call-tags.reducer';
import { CategoryReportsState } from '@secure/category-reports-list/category-reports-list.model';
import { CategoryReportsReducer } from '@secure/category-reports-list/store/category-reports-list.reducer';
import { SubCategoryReportsReducer } from '@secure/category-reports-list/sub-category-reports-list/store/sub-category-reports-list.reduser';
import { SubCategoryReportsState } from '@secure/category-reports-list/sub-category-reports-list/sub-category-reports-list.model';
import { CategoryState } from '@secure/category/category.model';
import { categoryReducer } from '@secure/category/store/category.reducer';
import { subCategoryReducer } from '@secure/category/sub-category/store/sub-category.reducer';
import { SubCategoryState } from '@secure/category/sub-category/sub-category.model';
import { CmsState, SosState } from '@secure/Database/cms.model';
import { cmsReducer } from '@secure/Database/store/cms.reducer';
import { ContactsState } from '@secure/contacts/contacts.model';
import { contactsReducer } from '@secure/contacts/store/contacts.reducer';
import { FlightStatusState } from '@secure/flight-status/flight-status.model';
import { flightStatusReducer } from '@secure/flight-status/store/flight-status.reducer';
import { surveyInvitationReducer } from '@secure/survey-invitation-list/store/survey-invitation-list.reducer';
import { SurveyInvitationState } from '@secure/survey-invitation-list/survey-invitation-list.model';
import { surveyFormResponseReducer } from '@secure/survey-form-response/store/survey-form-response.reducer';
import { SurveyFormResponseState } from '@secure/survey-form-response/survey-form-response.model';
import { surveyReducer } from '@secure/survey-form/store/survey-list.reducer';
import { SurveyState } from '@secure/survey-form/survey-list.model';
import { UserState } from '@secure/user/user.model';
import { userReducer } from './views/secure/user/store/user.reducer';
import { TerminalState } from '@secure/terminal/terminal.model';
import { terminalReducer } from '@secure/terminal/store/terminal.reducer';
import { CallsState } from '@secure/abandoned-calls/abandoned-calls.model';
import { abandonedCallsReducer } from '@secure/abandoned-calls/store/abandoned-calls.reducer';
import { callBackReducer } from '@secure/abandoned-calls/callback-list/store/callback-calls.reducer';
import { calledBackReducer } from '@secure/abandoned-calls/calledback-list/store/calledback-calls.reducer';
import { TerminalInfoState } from '@secure/terminal-info/terminal-info.model';
import { terminalInfoReducer } from '@secure/terminal-info/store/terminal-info.reducer';
import { TagCallState, UntagCallState } from '@secure/live-call/live-call.model';
import { untaggedCallsReducer } from '@secure/live-call/store/untagged-calls.reducer';
import { ReportsState, TemplateListState } from '@secure/reports/report-manager.model';
import { reportsReducer } from '@secure/reports/store/reports.reducer';
import { tagCallReducer } from '@shared/components/tag-call-component/store/tag-call.reducer';
import { templateListReducer } from '@secure/reports/dynamic-reports/template-list/store/template-list.reducer';
import { sosReducer } from '@secure/Database/help-sos/store/help-sos.reducer';

export interface AppState {
  authenticationState: AuthenticationState;
  userState: UserState;
  categoryState: CategoryState;
  subCategoryState: SubCategoryState;
  flightStatusState: FlightStatusState;
  cmsState: CmsState;
  sosState: SosState;
  contactsState: ContactsState;
  surveyFormResponseState: SurveyFormResponseState;
  surveyState: SurveyState;
  surveyInvitationState: SurveyInvitationState;
  callTagsState: CallTagsState;
  categoryReportsState: CategoryReportsState;
  subCategoryReportsState: SubCategoryReportsState;
  terminalState: TerminalState;
  abandonedCallsState: CallsState;
  callBackState: CallsState;
  calledBackState: CallsState;
  terminalInfoState: TerminalInfoState;
  untaggedCallsState: UntagCallState;
  reportsState: ReportsState;
  tagCallState: TagCallState;
  templateListState: TemplateListState;
}

export const appReducers: ActionReducerMap<AppState> = {
  authenticationState: authenticationReducer,
  userState: userReducer,
  categoryState: categoryReducer,
  subCategoryState: subCategoryReducer,
  flightStatusState: flightStatusReducer,
  cmsState: cmsReducer,
  sosState: sosReducer,
  contactsState: contactsReducer,
  surveyFormResponseState: surveyFormResponseReducer,
  surveyState: surveyReducer,
  surveyInvitationState: surveyInvitationReducer,
  callTagsState: callTagsReducer,
  categoryReportsState: CategoryReportsReducer,
  subCategoryReportsState: SubCategoryReportsReducer,
  terminalState: terminalReducer,
  abandonedCallsState: abandonedCallsReducer,
  callBackState: callBackReducer,
  calledBackState: calledBackReducer,
  terminalInfoState: terminalInfoReducer,
  untaggedCallsState: untaggedCallsReducer,
  reportsState: reportsReducer,
  tagCallState: tagCallReducer,
  templateListState: templateListReducer,
};
