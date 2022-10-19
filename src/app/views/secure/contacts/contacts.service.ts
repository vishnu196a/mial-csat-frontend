import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeleteResponse } from '@shared/models/shared.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  RolesList,
  ContactsList,
  ContactsState,
  ContactsForm,
  ContactsResponse,
  NameAndId,
} from './contacts.model';
import { SetContactsPagination } from './store/contacts.actions';
import { contactsState } from './store/contacts.selector';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  addContact(contacts: ContactsForm): Observable<ContactsResponse> {
    return this.httpClient.post<ContactsResponse>(`${this.apiUrl}/v1/contacts`, contacts);
  }

  getCategoriesNameId(): Observable<NameAndId[]> {
    return this.httpClient.get<NameAndId[]>(`${this.apiUrl}/v1/categories/names_and_ids`);
  }

  getSubCategoriesNameId(categoryId: number): Observable<NameAndId[]> {
    return this.httpClient.get<NameAndId[]>(
      `${this.apiUrl}/v1/categories/${categoryId}/sub_categories/names_and_ids`
    );
  }

  getContactsList(): Observable<ContactsList> {
    let params = new HttpParams();
    this.store.pipe(select(contactsState), take(1)).subscribe((contactsData: ContactsState) => {
      params = params.appendAll({
        q: contactsData.globalSearch,
        per_page: contactsData.pagination.per_page.toString(),
        page: contactsData.pagination.current_page.toString(),
        ...contactsData.columns,
      });
    });
    return this.httpClient.get<ContactsList>(`${this.apiUrl}/v1/contacts`, { params }).pipe(
      map((response: ContactsList): ContactsList => {
        this.store.dispatch(new SetContactsPagination(response.pagination));
        return response;
      })
    );
  }
  getRoles(): Observable<RolesList[]> {
    return this.httpClient.get<RolesList[]>(`${this.apiUrl}/v1/roles`);
  }

  getContactsDetails(contactId: number): Observable<ContactsResponse> {
    return this.httpClient.get<ContactsResponse>(`${this.apiUrl}/v1/contacts/${contactId}`);
  }

  updateContacts(contact: ContactsForm, contactId: number): Observable<ContactsResponse> {
    return this.httpClient.put<ContactsResponse>(
      `${this.apiUrl}/v1/contacts/${contactId}`,
      contact
    );
  }
  delete(contactId: number): Observable<DeleteResponse> {
    return this.httpClient.delete<DeleteResponse>(`${this.apiUrl}/v1/contacts/${contactId}`);
  }

  getTerminalNamesIds(): Observable<NameAndId[]> {
    return this.httpClient.get<NameAndId[]>(`${this.apiUrl}/v1/terminals/names_and_ids`);
  }
}
