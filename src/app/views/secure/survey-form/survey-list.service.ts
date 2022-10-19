import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FloatingFilterSearchData } from '@shared/models/shared.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SetSurveyPagination } from './store/survey-list.actions';
import { surveyState } from './store/survey-list.selector';
import {
  AddSurveyForm,
  SurveyFormDetails,
  SurveyInvitationForm,
  SurveyList,
  SurveyReportList,
  SurveyResponse,
  SurveyResponseForm,
  SurveyState,
} from './survey-list.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyListService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}
  getSurvey(): Observable<SurveyList> {
    let params = new HttpParams();
    this.store.pipe(select(surveyState), take(1)).subscribe((surveyData: SurveyState) => {
      params = params.appendAll({
        q: surveyData.globalSearch,
        per_page: surveyData.pagination.per_page.toString(),
        page: surveyData.pagination.current_page.toString(),
        ...surveyData.columns,
      });
    });
    return this.httpClient.get<SurveyList>(`${this.apiUrl}/v1/survey_forms`, { params }).pipe(
      map((response: SurveyList): SurveyList => {
        this.store.dispatch(new SetSurveyPagination(response.pagination));
        return response;
      })
    );
  }
  addForm(surveyForm: AddSurveyForm): Observable<AddSurveyForm> {
    return this.httpClient.post<AddSurveyForm>(`${this.apiUrl}/v1/survey_forms`, surveyForm);
  }
  getSurveyFormDetails(id: number): Observable<SurveyFormDetails> {
    return this.httpClient.get<SurveyFormDetails>(`${this.apiUrl}/v1/survey_forms/${id}`);
  }
  disableForm(id: number): Observable<AddSurveyForm> {
    return this.httpClient.put<AddSurveyForm>(`${this.apiUrl}/v1/survey_forms/${id}`, {});
  }
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
  surveyReportList(
    formId: number,
    page: number,
    per_page: number,
    searchData: FloatingFilterSearchData
  ): Observable<SurveyReportList> {
    let params = new HttpParams();
    params = params.appendAll({
      per_page: per_page.toString(),
      page: page.toString(),
      ...searchData,
    });
    return this.httpClient.get<SurveyReportList>(
      `${this.apiUrl}/v1/survey_forms/${formId}/reports`,
      { params }
    );
  }
}
