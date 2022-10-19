import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SurveyFormResponseList, SurveyFormResponseState } from './survey-form-response.model';
import { SetSurveyFormResponsePagination } from './store/survey-form-response.actions';
import { surveyformresponseState } from './store/survey-form-response.selector';
import { SurveyResponseView } from '@secure/survey-form/survey-list.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyFormResponseService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  getSurveyFormResponseList(): Observable<SurveyFormResponseList> {
    let params = new HttpParams();
    this.store
      .pipe(select(surveyformresponseState), take(1))
      .subscribe((surveyformresponseData: SurveyFormResponseState) => {
        params = params.appendAll({
          q: surveyformresponseData.globalSearch,
          per_page: surveyformresponseData.pagination.per_page.toString(),
          page: surveyformresponseData.pagination.current_page.toString(),
          ...surveyformresponseData.columns,
        });
      });
    return this.httpClient
      .get<SurveyFormResponseList>(`${this.apiUrl}/v1/surveys/responses`, { params })
      .pipe(
        map((response: SurveyFormResponseList): SurveyFormResponseList => {
          this.store.dispatch(new SetSurveyFormResponsePagination(response.pagination));
          return response;
        })
      );
  }
  getSurveyFormDetails(id: number): Observable<SurveyResponseView> {
    return this.httpClient.get<SurveyResponseView>(`${this.apiUrl}/v1/surveys/responses/${id}`);
  }
}
