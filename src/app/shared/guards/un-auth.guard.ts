import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { select, Store } from '@ngrx/store';
import { UserRoleAndToken } from '@public/authentication/authentication.model';
import { getUserRoleAndToken } from '@public/authentication/store/authentication.selector';
import { APP_ROUTES } from '@shared/constants/constants';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UnAuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store<Store>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let currentUser: UserRoleAndToken;
    this.store.pipe(select(getUserRoleAndToken), take(1)).subscribe((user: UserRoleAndToken) => {
      currentUser = user;
    });

    if (currentUser.token) {
      this.router.navigate([APP_ROUTES.defaultHomePage]);
      return false;
    }
    return true;
  }
}
