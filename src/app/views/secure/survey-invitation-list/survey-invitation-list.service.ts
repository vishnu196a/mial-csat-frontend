import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SurveyInvitationList, SurveyInvitationState } from './survey-invitation-list.model';
import { map, take } from 'rxjs/operators';
import { SetSurveyInvitationPagination } from './store/survey-invitation-list.actions';
import { surveyInvitationState } from './store/survey-invitation-list.selector';
import { MessageResponse } from '@secure/category/category.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyInvitationListService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}
  getSurvey(): Observable<SurveyInvitationList> {
    let params = new HttpParams();
    this.store
      .pipe(select(surveyInvitationState), take(1))
      .subscribe((surveyInvitationData: SurveyInvitationState) => {
        params = params.appendAll({
          q: surveyInvitationData.globalSearch,
          per_page: surveyInvitationData.pagination.per_page.toString(),
          page: surveyInvitationData.pagination.current_page.toString(),
          ...surveyInvitationData.columns,
        });
      });
    return this.httpClient
      .get<SurveyInvitationList>(`${this.apiUrl}/v1/surveys/invitation_list`, { params })
      .pipe(
        map((response: SurveyInvitationList): SurveyInvitationList => {
          this.store.dispatch(new SetSurveyInvitationPagination(response.pagination));
          return response;
        })
      );
  }

  resendInvitation(id: number): Observable<MessageResponse> {
    return this.httpClient.put<MessageResponse>(`${this.apiUrl}/v1/surveys/resend/${id}`, {});
  }
}
