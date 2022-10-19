import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangePwdRequestParams, ChangePwdResponse } from './profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  changePassword(params: ChangePwdRequestParams): Observable<ChangePwdResponse> {
    return this.httpClient.post<ChangePwdResponse>(
      `${this.apiUrl}/v1/passwords/change_password`,
      params
    );
  }
}
