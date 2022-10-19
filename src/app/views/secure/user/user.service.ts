import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { DeleteResponse, ResponseMessage } from '@shared/models/shared.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RolesList, UserForm, UserList, UserResponse, UserState } from './user.model';
import { SetUserPagination } from './store/user.actions';
import { userState } from './store/user.selector';
import { NameAndId } from '@secure/Database/cms.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient, private store: Store) {}

  addUser(user: UserForm): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUrl}/v1/users`, user);
  }

  getUsers(): Observable<UserList> {
    let params = new HttpParams();
    this.store.pipe(select(userState), take(1)).subscribe((parkData: UserState) => {
      params = params.appendAll({
        q: parkData.globalSearch,
        per_page: parkData.pagination.per_page.toString(),
        page: parkData.pagination.current_page.toString(),
        ...parkData.columns,
      });
    });
    return this.httpClient.get<UserList>(`${this.apiUrl}/v1/users`, { params }).pipe(
      map((response: UserList): UserList => {
        this.store.dispatch(new SetUserPagination(response.pagination));
        return response;
      })
    );
  }

  delete(userId: number): Observable<DeleteResponse> {
    return this.httpClient.delete<DeleteResponse>(`${this.apiUrl}/v1/users/${userId}`);
  }

  getUserDetails(userId: number): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${this.apiUrl}/v1/users/${userId}`);
  }

  updateUser(user: UserForm, userId: number): Observable<UserResponse> {
    return this.httpClient.put<UserResponse>(`${this.apiUrl}/v1/users/${userId}`, user);
  }
  sendInvitation(userId: number): Observable<ResponseMessage> {
    return this.httpClient.post<ResponseMessage>(
      `${this.apiUrl}/v1/park_users/${userId}/send_invitation`,
      null
    );
  }
  getRoles(): Observable<RolesList[]> {
    return this.httpClient.get<RolesList[]>(`${this.apiUrl}/v1/roles`);
  }
  getUsersNameId(): Observable<NameAndId[]> {
    return this.httpClient.get<NameAndId[]>(`${this.apiUrl}/v1/users/names_and_ids`);
  }
}
