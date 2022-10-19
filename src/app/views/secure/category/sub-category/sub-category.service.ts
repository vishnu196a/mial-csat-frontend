import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeleteResponse } from '@shared/models/shared.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  SubCategory,
  SubCategoryList,
  SubCategoryResponse,
  SubCategoryState,
} from './sub-category.model';
import { SetSubCategoryPagination } from './store/sub-category.actions';
import { categoryState } from './store/sub-category.selector';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  addSubCategory(subCategory: SubCategory, categoryId: number): Observable<SubCategory> {
    return this.httpClient.post<SubCategory>(
      `${this.apiUrl}/v1/categories/${categoryId}/sub_categories`,
      subCategory
    );
  }

  getSubCategoryList(categoryId: number): Observable<SubCategoryList> {
    let params = new HttpParams();
    this.store.pipe(select(categoryState), take(1)).subscribe((parkData: SubCategoryState) => {
      params = params.appendAll({
        q: parkData.globalSearch,
        per_page: parkData.pagination.per_page.toString(),
        page: parkData.pagination.current_page.toString(),
      });
    });
    return this.httpClient
      .get<SubCategoryList>(`${this.apiUrl}/v1/categories/${categoryId}/sub_categories`, { params })
      .pipe(
        map((response: SubCategoryList): SubCategoryList => {
          this.store.dispatch(new SetSubCategoryPagination(response.pagination));
          return response;
        })
      );
  }

  delete(categoryId: number, subcategoryId: number): Observable<DeleteResponse> {
    return this.httpClient.delete<DeleteResponse>(
      `${this.apiUrl}/v1/categories/${categoryId}/sub_categories/${subcategoryId}`
    );
  }

  getSubCategoryDetails(
    categoryId: number,
    subCategoryId: number
  ): Observable<SubCategoryResponse> {
    return this.httpClient.get<SubCategoryResponse>(
      `${this.apiUrl}/v1/categories/${categoryId}/sub_categories/${subCategoryId}`
    );
  }

  updateSubCategory(
    subCategory: SubCategory,
    categoryId: number,
    subCategoryId: number
  ): Observable<SubCategory> {
    return this.httpClient.put<SubCategory>(
      `${this.apiUrl}/v1/categories/${categoryId}/sub_categories/${subCategoryId}`,
      subCategory
    );
  }
}
