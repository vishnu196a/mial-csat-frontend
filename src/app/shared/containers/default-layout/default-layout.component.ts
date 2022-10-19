import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { INavData } from '@coreui/angular';
import { Store } from '@ngrx/store';
import { UserNameAndRole } from '@public/authentication/authentication.model';
import { AuthenticationService } from '@public/authentication/authentication.service';
import { SignOut } from '@public/authentication/store/authentication.action';
import { getUserNameAndRole } from '@public/authentication/store/authentication.selector';
import { RolebasedPermissionService } from '@shared/services/rolebased-permission.service';
import { Subscription } from 'rxjs';
import { navItems } from '../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('notificationDropdown') notificationDropdown: ElementRef<HTMLElement>;
  public sidebarMinimized = true;
  public navItems: INavData[];
  user: UserNameAndRole;
  currentYear: number = new Date().getFullYear();
  private subscriptions = new Subscription();
  notifications: Notification[] = [];
  notificationCount = 0;

  constructor(
    private authService: AuthenticationService,
    private store: Store,
    private router: Router,
    private roleBasedPermission: RolebasedPermissionService
  ) {}

  ngOnInit(): void {
    this.navItems = this.roleBasedPermission.checkSideNavRoles(navItems);

    const observer = this.store.select(getUserNameAndRole).subscribe((user: UserNameAndRole) => {
      this.user = user;
    });
    this.subscriptions.add(observer);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleMinimize(e): void {
    this.sidebarMinimized = e;
  }

  onLogOut(): void {
    const observer = this.authService.logout().subscribe(
      () => {
        this.store.dispatch(new SignOut());
        this.router.navigate(['./login']);
      },
      () => {
        this.store.dispatch(new SignOut());
        this.router.navigate(['./login']);
      }
    );
    this.subscriptions.add(observer);
  }
}
