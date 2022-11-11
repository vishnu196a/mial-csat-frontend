import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { getToken } from './store/authentication.selector';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private store: Store) {}

  get token(): string {
    let authToken: string;
    this.store
      .select(getToken)
      .pipe(take(1))
      .subscribe((token: string) => {
        authToken = token;
      });
    return authToken;
  }
}
