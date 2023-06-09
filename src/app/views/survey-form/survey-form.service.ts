import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SurveyInvitationForm, SurveyResponse, SurveyResponseForm } from './survey-form.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyListService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}
  getSurveyInvitationForm(token: string): Observable<SurveyInvitationForm> {
    let params: HttpParams = new HttpParams();
    params = params.appendAll({
      t: token,
    });
    return this.httpClient.get<SurveyInvitationForm>(`${this.apiUrl}/v1/surveys/invitation`, {
      params,
    });
  }
  addSurveyResponse(surveyForm: SurveyResponseForm): Observable<SurveyResponse> {
    return this.httpClient.post<SurveyResponse>(`${this.apiUrl}/v1/surveys/responses`, surveyForm);
  }
}
