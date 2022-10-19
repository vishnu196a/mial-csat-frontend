import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { NameAndId } from '@secure/Database/cms.model';
import { DeleteResponse } from '@shared/models/shared.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SetTerminalInfoPagination } from './store/terminal-info.actions';
import { terminalInfoState } from './store/terminal-info.selector';
import {
  MessageResponse,
  TerminalInfo,
  TerminalInfoForm,
  TerminalInfoList,
  TerminalInfoState,
} from './terminal-info.model';

@Injectable({
  providedIn: 'root',
})
export class TerminalInfoService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  getTerminalInfoList(): Observable<TerminalInfoList> {
    let params = new HttpParams();
    this.store
      .pipe(select(terminalInfoState), take(1))
      .subscribe((terminalInfoData: TerminalInfoState) => {
        params = params.appendAll({
          q: terminalInfoData.globalSearch,
          per_page: terminalInfoData.pagination.per_page.toString(),
          page: terminalInfoData.pagination.current_page.toString(),
          ...terminalInfoData.columns,
        });
      });
    return this.httpClient
      .get<TerminalInfoList>(`${this.apiUrl}/v1/terminal_informations`, { params })
      .pipe(
        map((response: TerminalInfoList): TerminalInfoList => {
          this.store.dispatch(new SetTerminalInfoPagination(response.pagination));
          return response;
        })
      );
  }
  getTerminalNamesIds(): Observable<NameAndId[]> {
    return this.httpClient.get<NameAndId[]>(`${this.apiUrl}/v1/terminals/names_and_ids`);
  }
  addTerminalInformation(terminalInfo: TerminalInfoForm): Observable<MessageResponse> {
    return this.httpClient.post<MessageResponse>(
      `${this.apiUrl}/v1/terminal_informations`,
      terminalInfo
    );
  }
  getTerminalInformation(tInfoId: string): Observable<TerminalInfo> {
    return this.httpClient.get<TerminalInfo>(`${this.apiUrl}/v1/terminal_informations/${tInfoId}`);
  }
  updateTerminalInformation(tInfo: TerminalInfoForm, tInfoId: string): Observable<TerminalInfo> {
    return this.httpClient.put<TerminalInfo>(
      `${this.apiUrl}/v1/terminal_informations/${tInfoId}`,
      tInfo
    );
  }
  deleteTerminalInfo(tInfoId: string): Observable<DeleteResponse> {
    return this.httpClient.delete<DeleteResponse>(
      `${this.apiUrl}/v1/terminal_informations/${tInfoId}`
    );
  }
}
