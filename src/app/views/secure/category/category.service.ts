import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeleteResponse } from '@shared/models/shared.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category, CategoryList, CategoryState } from './category.model';
import { SetCategoryPagination } from './store/category.actions';
import { categoryState } from './store/category.selector';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  addCategory(name: Category): Observable<Category> {
    return this.httpClient.post<Category>(`${this.apiUrl}/v1/categories`, name);
  }

  getCategoryList(): Observable<CategoryList> {
    let params = new HttpParams();
    this.store.pipe(select(categoryState), take(1)).subscribe((parkData: CategoryState) => {
      params = params.appendAll({
        q: parkData.globalSearch,
        per_page: parkData.pagination.per_page.toString(),
        page: parkData.pagination.current_page.toString(),
      });
    });
    return this.httpClient.get<CategoryList>(`${this.apiUrl}/v1/categories`, { params }).pipe(
      map((response: CategoryList): CategoryList => {
        this.store.dispatch(new SetCategoryPagination(response.pagination));
        return response;
      })
    );
  }

  delete(categoryId: number): Observable<DeleteResponse> {
    return this.httpClient.delete<DeleteResponse>(`${this.apiUrl}/v1/categories/${categoryId}`);
  }

  getCategoryDetails(categoryId: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.apiUrl}/v1/categories/${categoryId}`);
  }

  updateCategory(category: Category, categoryId: number): Observable<Category> {
    return this.httpClient.put<Category>(`${this.apiUrl}/v1/categories/${categoryId}`, category);
  }
}
