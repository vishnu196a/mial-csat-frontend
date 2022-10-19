import { Injectable } from '@angular/core';
import { AuthenticationService } from '@public/authentication/authentication.service';
import { GridColumns, NavItems } from '@shared/models/shared.model';
import { ColDef } from 'ag-grid-community';
import { includes, map, omit } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class RolebasedPermissionService {
  currentUserRole: string;

  constructor(private authService: AuthenticationService) {}

  checkColumns(columns: GridColumns[]): ColDef[] {
    const userRole: string = this.authService.role();
    columns.map((column: GridColumns) => {
      if (column.roles && !includes(column.roles, userRole)) {
        column.hide = true;
      } else {
        column.hide = false;
      }
    });
    return map(columns, (column) => omit(column, ['roles']));
  }

  checkSideNavRoles(navItems: NavItems[]): NavItems[] {
    const userRole: string = this.authService.role();

    return navItems.filter(
      (navItem: NavItems) => navItem.roles === undefined || includes(navItem.roles, userRole)
    );
  }
}
