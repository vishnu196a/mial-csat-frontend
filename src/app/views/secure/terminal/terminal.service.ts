import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeleteResponse } from '@shared/models/shared.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SetTerminalPagination } from './store/terminal.actions';
import { terminalState } from './store/terminal.selector';
import { Terminal, TerminalList, TerminalResponse, TerminalState } from './terminal.model';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  addTerminal(name: Terminal): Observable<Terminal> {
    return this.httpClient.post<Terminal>(`${this.apiUrl}/v1/terminals`, name);
  }

  getTerminalList(): Observable<TerminalList> {
    let params = new HttpParams();
    this.store.pipe(select(terminalState), take(1)).subscribe((terminalData: TerminalState) => {
      params = params.appendAll({
        q: terminalData.globalSearch,
        per_page: terminalData.pagination.per_page.toString(),
        page: terminalData.pagination.current_page.toString(),
        ...terminalData.columns,
      });
    });
    return this.httpClient.get<TerminalList>(`${this.apiUrl}/v1/terminals`, { params }).pipe(
      map((response: TerminalList): TerminalList => {
        this.store.dispatch(new SetTerminalPagination(response.pagination));
        return response;
      })
    );
  }

  delete(terminalId: number): Observable<DeleteResponse> {
    return this.httpClient.delete<DeleteResponse>(`${this.apiUrl}/v1/terminals/${terminalId}`);
  }

  getTerminalDetails(terminalId: number): Observable<TerminalResponse> {
    return this.httpClient.get<TerminalResponse>(`${this.apiUrl}/v1/terminals/${terminalId}`);
  }

  updateTerminal(name: Terminal, terminalId: number): Observable<TerminalResponse> {
    return this.httpClient.put<TerminalResponse>(`${this.apiUrl}/v1/terminals/${terminalId}`, name);
  }
}
