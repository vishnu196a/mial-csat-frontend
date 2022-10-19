import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { MessageResponse } from '@secure/category/category.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  AddContent,
  AddContentResponse,
  CmsList,
  CmsState,
  CmsView,
  NameAndId,
  Sos,
  SosForm,
  SosList,
  SosState,
} from './cms.model';
import { SetCmsPagination } from './store/cms.actions';
import { cmsState } from './store/cms.selector';
import { sosState } from './help-sos/store/help-sos.selector';
import { SetSosPagination } from './help-sos/store/help-sos.actions';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  getCmsList(): Observable<CmsList> {
    let params = new HttpParams();
    this.store.pipe(select(cmsState), take(1)).subscribe((cmsData: CmsState) => {
      params = params.appendAll({
        q: cmsData.globalSearch,
        per_page: cmsData.pagination.per_page.toString(),
        page: cmsData.pagination.current_page.toString(),
        ...cmsData.columns,
      });
    });
    return this.httpClient
      .get<CmsList>(`${this.apiUrl}/v1/content_management_system`, { params })
      .pipe(
        map((response: CmsList): CmsList => {
          this.store.dispatch(new SetCmsPagination(response.pagination));
          return response;
        })
      );
  }

  addContent(content: AddContent): Observable<AddContentResponse> {
    return this.httpClient.post<AddContentResponse>(
      `${this.apiUrl}/v1/content_management_system`,
      content
    );
  }

  getCategoriesNameId(): Observable<NameAndId[]> {
    return this.httpClient.get<NameAndId[]>(`${this.apiUrl}/v1/categories/names_and_ids`);
  }

  getSubCategoriesNameId(categoryId: number): Observable<NameAndId[]> {
    return this.httpClient.get<NameAndId[]>(
      `${this.apiUrl}/v1/categories/${categoryId}/sub_categories/names_and_ids`
    );
  }
  getContent(contentId: number): Observable<CmsView> {
    return this.httpClient.get<CmsView>(`${this.apiUrl}/v1/content_management_system/${contentId}`);
  }
  delete(contentId: number): Observable<MessageResponse> {
    return this.httpClient.delete<MessageResponse>(
      `${this.apiUrl}/v1/content_management_system/${contentId}`
    );
  }
  updateContent(contentId: number, content: AddContent): Observable<AddContentResponse> {
    return this.httpClient.put<AddContentResponse>(
      `${this.apiUrl}/v1/content_management_system/${contentId}`,
      content
    );
  }

  getSosList(): Observable<SosList> {
    let params = new HttpParams();
    this.store.pipe(select(sosState), take(1)).subscribe((contactsData: SosState) => {
      params = params.appendAll({
        q: contactsData.globalSearch,
        per_page: contactsData.pagination.per_page.toString(),
        page: contactsData.pagination.current_page.toString(),
        ...contactsData.columns,
      });
    });
    return this.httpClient.get<SosList>(`${this.apiUrl}/v1/extension_types`, { params }).pipe(
      map((response: SosList): SosList => {
        this.store.dispatch(new SetSosPagination(response.pagination));
        return response;
      })
    );
  }

  addSosHelpDesk(sosForm: SosForm): Observable<Sos> {
    return this.httpClient.post<Sos>(`${this.apiUrl}/v1/extension_types`, sosForm);
  }

  deleteSosHelpDesk(sosId: number): Observable<MessageResponse> {
    return this.httpClient.delete<MessageResponse>(`${this.apiUrl}/v1/extension_types/${sosId}`);
  }

  getSosDetails(sosId: number): Observable<Sos> {
    return this.httpClient.get<Sos>(`${this.apiUrl}/v1/extension_types/${sosId}`);
  }

  updateSos(sosDetails, sosId: number): Observable<Sos> {
    return this.httpClient.put<Sos>(`${this.apiUrl}/v1/extension_types/${sosId}`, sosDetails);
  }
}
