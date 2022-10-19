import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { SharedService } from '@shared/services/shared.service';
import { Observable } from 'rxjs';
import { ColumnState } from 'ag-grid-community';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CallTagDetails, CallTagsList, CallTagsState } from './call-tags.model';
import { SetCallTagsPagination } from './store/call-tags.actions';
import { callTagsState } from './store/call-tags.selector';

@Injectable({
  providedIn: 'root',
})
export class CallTagsService {
  apiUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private store: Store,
    private shared: SharedService
  ) {}

  getCallTags(sort?: ColumnState): Observable<CallTagsList> {
    let params = new HttpParams();
    this.store.pipe(select(callTagsState), take(1)).subscribe((callTagsData: CallTagsState) => {
      const fromFormatted = this.shared.getReportFilterDate(callTagsData.columns.from.toString());
      const toFromatted = this.shared.getReportFilterDate(callTagsData.columns.to.toString());
      params = params.appendAll({
        q: callTagsData.globalSearch,
        per_page: callTagsData.pagination.per_page.toString(),
        page: callTagsData.pagination.current_page.toString(),
        category_name: callTagsData.columns.category_name.toString(),
        created_by_name: callTagsData.columns.created_by_name.toString(),
        sub_category_name: callTagsData.columns.sub_category_name.toString(),
      });
      if (fromFormatted && toFromatted) {
        params = params.set('from', fromFormatted);
        params = params.set('to', toFromatted);
      }
    });
    if (sort) {
      params = params.append(`o_${sort.colId}`, sort.sort.toUpperCase());
    }
    return this.httpClient.get<CallTagsList>(`${this.apiUrl}/v1/call_tags`, { params }).pipe(
      map((callTags: CallTagsList): CallTagsList => {
        this.store.dispatch(new SetCallTagsPagination(callTags.pagination));
        return callTags;
      })
    );
  }
  getCallTagDetails(callTagId: number): Observable<CallTagDetails> {
    return this.httpClient.get<CallTagDetails>(`${this.apiUrl}/v1/call_tags/${callTagId}`);
  }
}
