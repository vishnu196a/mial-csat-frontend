import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ColumnState } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryReportsDetails } from '../category-reports-list.model';
import { SetSubCategoryReportsPagination } from './store/sub-category-reports-list.actions';
import { subCategoryReportsState } from './store/sub-category-reports-list.selector';
import { SubCategoryReportsList, SubCategoryReportsState } from './sub-category-reports-list.model';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryReportsListService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}
  getSubCategoryReports(
    categoryId: number,
    from: string,
    to: string,
    sort?: ColumnState
  ): Observable<SubCategoryReportsList> {
    let params = new HttpParams();
    this.store
      .pipe(select(subCategoryReportsState), take(1))
      .subscribe((subCategoryReportsData: SubCategoryReportsState) => {
        params = params.appendAll({
          q: subCategoryReportsData.globalSearch,
          per_page: subCategoryReportsData.pagination.per_page.toString(),
          page: subCategoryReportsData.pagination.current_page.toString(),
          ...subCategoryReportsData.columns,
        });
      });

    params = params.append('from', from);
    params = params.append('to', to);
    if (sort) {
      params = params.append(`o_${sort.colId}`, sort.sort.toUpperCase());
    }
    return this.httpClient
      .get<SubCategoryReportsList>(`${this.apiUrl}/v1/reports/sub_categories/${categoryId}`, {
        params,
      })
      .pipe(
        map((response: SubCategoryReportsList): SubCategoryReportsList => {
          this.store.dispatch(new SetSubCategoryReportsPagination(response.pagination));
          return response;
        })
      );
  }

  getSubCategoryChartData(
    categoryId: number,
    fromDate: string,
    toDate: string
  ): Observable<CategoryReportsDetails[]> {
    let params = new HttpParams();
    params = params.appendAll({
      from: fromDate,
      to: toDate,
    });
    return this.httpClient.get<CategoryReportsDetails[]>(
      `${this.apiUrl}/v1/reports/sub_categories/chart/${categoryId}`,
      { params }
    );
  }
  getTopThreeRecords(
    categoryId: number,
    from: string,
    to: string
  ): Observable<CategoryReportsDetails[]> {
    let params = new HttpParams();
    params = params.appendAll({
      from: from,
      to: to,
    });
    return this.httpClient.get<CategoryReportsDetails[]>(
      `${this.apiUrl}/v1/reports/sub_categories/top_three/${categoryId}`,
      {
        params,
      }
    );
  }
}
