import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CallTagsList } from '@secure/call-tags/call-tags.model';
import { IdAndDesc, NameAndId } from '@secure/Database/cms.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  BusinessForm,
  BusinessResponse,
  CallTag,
  EmergencyCallResponse,
  EmergencyForm,
  FeedbackCallResponse,
  FeedbackForm,
  LiveCallList,
  ManualCallResponse,
  ManualCallTag,
  PreFillData,
  RequestCallForm,
  RequestCallResponse,
  TagCall,
  UntagCallList,
  UntagCallState,
} from './live-call.model';
import { SetUntaggedPagination } from './store/untagged-calls.actions';
import { untaggedCallsState } from './store/untagged-calls.selector';

@Injectable({
  providedIn: 'root',
})
export class LiveCallService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  getLiveCallList(): Observable<LiveCallList[]> {
    return this.httpClient.get<LiveCallList[]>(`${this.apiUrl}/v1/live_calls`);
  }
  tagCall(callTag: TagCall): Observable<CallTag> {
    return this.httpClient.post<CallTag>(`${this.apiUrl}/v1/call_tags`, callTag);
  }
  abandonedCallsTag(callTag: TagCall): Observable<CallTag> {
    return this.httpClient.put<CallTag>(
      `${this.apiUrl}/v1/abandoned_calls/call_back_queue/${callTag.call_entry_id}`,
      callTag
    );
  }

  manualCallTag(manualCallTagForm: ManualCallTag): Observable<ManualCallResponse> {
    return this.httpClient.post<ManualCallResponse>(
      `${this.apiUrl}/v1/call_tags/manual`,
      manualCallTagForm
    );
  }

  getTerminalNamesIds(): Observable<NameAndId[]> {
    return this.httpClient.get<NameAndId[]>(`${this.apiUrl}/v1/terminals/names_and_ids`);
  }
  getLanguageNamesIds(): Observable<IdAndDesc[]> {
    return this.httpClient.get<IdAndDesc[]>(`${this.apiUrl}/v1/queue_call_entry/names_and_ids`);
  }
  getCallTags(per_page: number, page: number, contact: string): Observable<CallTagsList> {
    let params = new HttpParams();
    if (contact && contact.includes('+')) {
      contact = contact.replace('+', '');
    }
    params = params.appendAll({
      per_page: per_page.toString(),
      page: page.toString(),
      contact_number: contact,
    });
    return this.httpClient.get<CallTagsList>(`${this.apiUrl}/v1/call_tags`, { params }).pipe(
      map((callTags: CallTagsList): CallTagsList => {
        return callTags;
      })
    );
  }
  getUntagCalls(): Observable<UntagCallList> {
    let params = new HttpParams();
    this.store
      .pipe(select(untaggedCallsState), take(1))
      .subscribe((callTagsData: UntagCallState) => {
        params = params.appendAll({
          q: callTagsData.globalSearch,
          per_page: callTagsData.pagination.per_page.toString(),
          page: callTagsData.pagination.current_page.toString(),
        });
      });
    return this.httpClient
      .get<UntagCallList>(`${this.apiUrl}/v1/untaged_call_tags`, { params })
      .pipe(
        map((callTags: UntagCallList): UntagCallList => {
          this.store.dispatch(new SetUntaggedPagination(callTags.pagination));
          return callTags;
        })
      );
  }
  emergencyCallTag(emergencyForm: EmergencyForm): Observable<EmergencyCallResponse> {
    return this.httpClient.post<EmergencyCallResponse>(
      `${this.apiUrl}/v1/emergency_emails`,
      emergencyForm
    );
  }
  feedBackCallTag(feedbackForm: FeedbackForm): Observable<FeedbackCallResponse> {
    return this.httpClient.post<FeedbackCallResponse>(
      `${this.apiUrl}/v1/feedback_emails`,
      feedbackForm
    );
  }
  requestCallTag(requestForm: RequestCallForm): Observable<RequestCallResponse> {
    const formDummy = { ...requestForm };
    if (!formDummy.date_of_birth) {
      delete formDummy['date_of_birth'];
    }
    if (!formDummy.date_of_issue) {
      delete formDummy['date_of_issue'];
    }
    return this.httpClient.post<RequestCallResponse>(`${this.apiUrl}/v1/request_emails`, formDummy);
  }
  businessCallTag(businessForm: BusinessForm): Observable<BusinessResponse> {
    return this.httpClient.post<BusinessResponse>(
      `${this.apiUrl}/v1/business_enquiry_emails`,
      businessForm
    );
  }
  getPreFillCallDetails(callEntryId: number): Observable<PreFillData> {
    return this.httpClient.get<PreFillData>(`${this.apiUrl}/v1/call_tags/info/${callEntryId}`);
  }
}
