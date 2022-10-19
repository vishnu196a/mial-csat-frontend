import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ColumnState } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FlightStatusDetails, FlightStatusList, FlightStatusState } from './flight-status.model';
import { SetFlightStatusPagination } from './store/flight-status.actions';
import { flightStatusState } from './store/flight-status.selector';

@Injectable({
  providedIn: 'root',
})
export class FlightStatusService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  getFlightStatus(sort?: ColumnState): Observable<FlightStatusList> {
    let params = new HttpParams();
    this.store.pipe(select(flightStatusState), take(1)).subscribe((parkData: FlightStatusState) => {
      params = params.appendAll({
        q: parkData.globalSearch,
        per_page: parkData.pagination.per_page.toString(),
        page: parkData.pagination.current_page.toString(),
        ...parkData.columns,
      });
    });
    if (sort) {
      params = params.append(`o_${sort.colId}`, sort.sort.toUpperCase());
    }
    return this.httpClient
      .get<FlightStatusList>(`${this.apiUrl}/v1/flight_status`, { params })
      .pipe(
        map((response: FlightStatusList): FlightStatusList => {
          this.store.dispatch(new SetFlightStatusPagination(response.pagination));
          return response;
        })
      );
  }

  getFlightStatusDetails(id: number): Observable<FlightStatusDetails> {
    return this.httpClient.get<FlightStatusDetails>(`${this.apiUrl}/v1/flight_status/${id}`);
  }
}
