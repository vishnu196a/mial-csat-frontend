import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { freeSet } from '@coreui/icons';
import { IconSetService } from '@coreui/icons-angular';
import { Store } from '@ngrx/store';
import { getUserRole } from '@public/authentication/store/authentication.selector';
import { PERMISSIONS, ROLES } from '@shared/constants/constants';
import { NavigationService } from '@shared/services/navigation.service';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Subscription } from 'rxjs';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();

  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private rolesService: NgxRolesService,
    private permissionService: NgxPermissionsService,
    private store: Store,
    private navigationService: NavigationService
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
  }

  ngOnInit(): void {
    this.navigationService.startSaveHistory();

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    const observer = this.store.select(getUserRole).subscribe((role: string) => {
      let updatedRole: string = ROLES.ADMIN;
      if (role) {
        updatedRole = role.toUpperCase().split(' ').join('_');
      }
      const permissions = PERMISSIONS[updatedRole];

      this.rolesService.addRole(updatedRole, permissions);
      this.permissionService.loadPermissions(permissions);
    });
    this.subscriptions.add(observer);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
