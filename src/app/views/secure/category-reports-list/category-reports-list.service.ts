import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CategoryReportsDetails,
  CategoryReportsList,
  CategoryReportsState,
} from './category-reports-list.model';
import { map, take } from 'rxjs/operators';
import { SetCategoryReportsPagination } from './store/category-reports-list.actions';
import { categoryReportsState } from './store/category-reports-list.selector';
import { ColumnState } from 'ag-grid-community';

@Injectable({
  providedIn: 'root',
})
export class CategoryReportsListService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}
  getCategoryReports(
    fromDate?: string,
    toDate?: string,
    sort?: ColumnState
  ): Observable<CategoryReportsList> {
    let params = new HttpParams();
    this.store
      .pipe(select(categoryReportsState), take(1))
      .subscribe((categoryReportsData: CategoryReportsState) => {
        params = params.appendAll({
          q: categoryReportsData.globalSearch,
          per_page: categoryReportsData.pagination.per_page.toString(),
          page: categoryReportsData.pagination.current_page.toString(),
          ...categoryReportsData.columns,
        });
      });
    if (fromDate || toDate) {
      params = params.append('from', fromDate);
      params = params.append('to', toDate);
    }
    if (sort) {
      params = params.append(`o_${sort.colId}`, sort.sort.toUpperCase());
    }
    return this.httpClient
      .get<CategoryReportsList>(`${this.apiUrl}/v1/reports/categories`, { params })
      .pipe(
        map((response: CategoryReportsList): CategoryReportsList => {
          this.store.dispatch(new SetCategoryReportsPagination(response.pagination));
          return response;
        })
      );
  }
  getCategoryReportsDetails(id: number): Observable<CategoryReportsDetails> {
    return this.httpClient.get<CategoryReportsDetails>(
      `${this.apiUrl}/v1/reports/sub_categories/${id}`
    );
  }
  getCategoryChartData(fromDate: string, toDate: string): Observable<CategoryReportsDetails[]> {
    let params = new HttpParams();
    params = params.appendAll({
      from: fromDate,
      to: toDate,
    });
    return this.httpClient.get<CategoryReportsDetails[]>(
      `${this.apiUrl}/v1/reports/categories/chart`,
      { params }
    );
  }
  downloadSubCategoryData(category_id: number, fromDate: string, toDate: string): Observable<any> {
    let params = new HttpParams();
    params = params.appendAll({
      from: fromDate,
      to: toDate,
    });
    return this.httpClient.get(`${this.apiUrl}/v1/reports/sub_categories/download/${category_id}`, {
      params,
      observe: 'response',
      responseType: 'blob',
    });
  }
  downloadCategoryData(fromDate: string, toDate: string): Observable<any> {
    let params = new HttpParams();
    params = params.appendAll({
      from: fromDate,
      to: toDate,
    });

    return this.httpClient.get(`${this.apiUrl}/v1/reports/categories/download`, {
      params,
      observe: 'response',
      responseType: 'blob',
    });
  }
}
