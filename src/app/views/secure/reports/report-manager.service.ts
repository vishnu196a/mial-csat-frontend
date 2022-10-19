import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SetTemplateListPagination } from './dynamic-reports/template-list/store/template-list.actions';
import { templateListState } from './dynamic-reports/template-list/store/template-list.selector';
import {
  DownloadStatic,
  DynamicReportForm,
  ReportColumns,
  ReportsList,
  ReportsState,
  SavedTemplates,
  StaticReports,
  TemplateListState,
} from './report-manager.model';
import { SetReportsPagination } from './store/reports.actions';
import { reportsState } from './store/reports.selector';

@Injectable({
  providedIn: 'root',
})
export class ReportManagerService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  getReportColumns(): Observable<ReportColumns> {
    return this.httpClient.get<ReportColumns>(`${this.apiUrl}/v1/reports/columns`);
  }

  getReportRecords(): Observable<ReportsList> {
    let params = new HttpParams();
    this.store.pipe(select(reportsState), take(1)).subscribe((reports: ReportsState) => {
      params = params.appendAll({
        q: reports.globalSearch,
        per_page: reports.pagination.per_page.toString(),
        page: reports.pagination.current_page.toString(),
      });
    });
    return this.httpClient.get<ReportsList>(`${this.apiUrl}/v1/download_queues`, { params }).pipe(
      map((reports: ReportsList): ReportsList => {
        this.store.dispatch(new SetReportsPagination(reports.pagination));
        return reports;
      })
    );
  }

  getStaticReport(): Observable<StaticReports> {
    return this.httpClient.get<StaticReports>(`${this.apiUrl}/v1/manager_reports`);
  }
  downloadReport(reportColumns: DynamicReportForm): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/v1/download_queues`, reportColumns);
  }
  saveAsTemplate(reportColumns: DynamicReportForm): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/v1/dynamic_report_templates`, reportColumns);
  }

  getSavedTemplates(): Observable<SavedTemplates> {
    let params = new HttpParams();
    this.store
      .pipe(select(templateListState), take(1))
      .subscribe((templates: TemplateListState) => {
        params = params.appendAll({
          q: templates.globalSearch,
          per_page: templates.pagination.per_page.toString(),
          page: templates.pagination.current_page.toString(),
          ...templates.columns,
        });
      });
    return this.httpClient
      .get<SavedTemplates>(`${this.apiUrl}/v1/dynamic_report_templates`, { params })
      .pipe(
        map((templates: SavedTemplates): SavedTemplates => {
          this.store.dispatch(new SetTemplateListPagination(templates.pagination));
          return templates;
        })
      );
  }

  downloadStaticReport(id: string, filters: DownloadStatic): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/v1/manager_reports/${id}`, filters);
  }
}
