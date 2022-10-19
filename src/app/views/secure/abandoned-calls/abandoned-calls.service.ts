import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MessageResponse } from '@secure/category/category.model';
import { SharedService } from '@shared/services/shared.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  AbandonedCallsList,
  CallBackList,
  CallDetails,
  CalledBackList,
  CallsState,
} from './abandoned-calls.model';
import { SetCallBackPagination } from './callback-list/store/callback-calls.actions';
import { callBackState } from './callback-list/store/callback-calls.selector';
import { calledBackState } from './calledback-list/store/calledback-calls.selector';
import { SetAbandonedCallsPagination } from './store/abandoned-calls.actions';
import { abandonedCallsState } from './store/abandoned-calls.selector';

@Injectable({
  providedIn: 'root',
})
export class AbandonedCallsService {
  apiUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private shared: SharedService
  ) {}
  getAbandonedCalls(): Observable<AbandonedCallsList> {
    let params = new HttpParams();
    this.store
      .pipe(select(abandonedCallsState), take(1))
      .subscribe((abandonedCallsData: CallsState) => {
        const fromFormatted = this.shared.getReportFilterDate(
          abandonedCallsData.columns.from.toString()
        );
        const toFromatted = this.shared.getReportFilterDate(
          abandonedCallsData.columns.to.toString()
        );
        params = params.appendAll({
          q: abandonedCallsData.globalSearch,
          per_page: abandonedCallsData.pagination.per_page.toString(),
          page: abandonedCallsData.pagination.current_page.toString(),
          contact_number: abandonedCallsData.columns.contact_number.toString(),
        });
        if (fromFormatted && toFromatted) {
          params = params.set('from', fromFormatted);
          params = params.set('to', toFromatted);
        }
      });
    return this.httpClient
      .get<AbandonedCallsList>(`${this.apiUrl}/v1/abandoned_calls`, { params })
      .pipe(
        map((response: AbandonedCallsList): AbandonedCallsList => {
          this.store.dispatch(new SetAbandonedCallsPagination(response.pagination));
          return response;
        })
      );
  }

  updateAbandonedCall(id: number): Observable<MessageResponse> {
    return this.httpClient.put<MessageResponse>(`${this.apiUrl}/v1/abandoned_calls/${id}`, {});
  }

  getCallBackCalls(): Observable<CallBackList> {
    let params = new HttpParams();
    this.store.pipe(select(callBackState), take(1)).subscribe((callBackData: CallsState) => {
      const fromFormatted = this.shared.getReportFilterDate(callBackData.columns.from.toString());
      const toFromatted = this.shared.getReportFilterDate(callBackData.columns.to.toString());
      params = params.appendAll({
        q: callBackData.globalSearch,
        per_page: callBackData.pagination.per_page.toString(),
        page: callBackData.pagination.current_page.toString(),
        contact_number: callBackData.columns.contact_number.toString(),
      });
      if (fromFormatted && toFromatted) {
        params = params.set('from', fromFormatted);
        params = params.set('to', toFromatted);
      }
    });
    return this.httpClient
      .get<CallBackList>(`${this.apiUrl}/v1/abandoned_calls/call_back_queue`, { params })
      .pipe(
        map((response: CallBackList): CallBackList => {
          this.store.dispatch(new SetCallBackPagination(response.pagination));
          return response;
        })
      );
  }

  updateCallBackCall(id: number): Observable<MessageResponse> {
    return this.httpClient.put<MessageResponse>(`${this.apiUrl}/v1/abandoned_calls/${id}`, {});
  }

  getCalledBackCalls(): Observable<CalledBackList> {
    let params = new HttpParams();
    this.store.pipe(select(calledBackState), take(1)).subscribe((calledBackData: CallsState) => {
      const fromFormatted = this.shared.getReportFilterDate(calledBackData.columns.from.toString());
      const toFromatted = this.shared.getReportFilterDate(calledBackData.columns.to.toString());
      params = params.appendAll({
        q: calledBackData.globalSearch,
        per_page: calledBackData.pagination.per_page.toString(),
        page: calledBackData.pagination.current_page.toString(),
        contact_number: calledBackData.columns.contact_number.toString(),
        type_of_called_back_queue: calledBackData.columns.type_of_called_back_queue.toString(),
      });
      if (fromFormatted && toFromatted) {
        params = params.set('from', fromFormatted);
        params = params.set('to', toFromatted);
      }
    });
    return this.httpClient
      .get<CalledBackList>(`${this.apiUrl}/v1/abandoned_calls/called_back_queue`, { params })
      .pipe(
        map((response: CalledBackList): CalledBackList => {
          this.store.dispatch(new SetCallBackPagination(response.pagination));
          return response;
        })
      );
  }
  getCallDetails(callId: number): Observable<CallDetails> {
    return this.httpClient.get<CallDetails>(
      `${this.apiUrl}/v1/abandoned_calls/call_back_queue/${callId}`
    );
  }
}
