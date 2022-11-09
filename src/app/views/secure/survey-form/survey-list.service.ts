import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SurveyInvitationForm, SurveyResponse, SurveyResponseForm } from './survey-list.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyListService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}
  getSurveyInvitationForm(token: string): Observable<SurveyInvitationForm> {
    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.httpClient.get<SurveyInvitationForm>(`${this.apiUrl}/v1/surveys/invitation`, {
      headers: headers,
    });
  }
  addSurveyResponse(surveyForm: SurveyResponseForm): Observable<SurveyResponse> {
    return this.httpClient.post<SurveyResponse>(`${this.apiUrl}/v1/surveys/responses`, surveyForm);
  }
}
