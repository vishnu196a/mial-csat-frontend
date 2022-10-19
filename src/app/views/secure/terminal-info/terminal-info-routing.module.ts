import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROLES } from '@shared/constants/constants';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
const routes: Routes = [
  { path: '', component: ListComponent },
  {
    path: 'new',
    component: AddComponent,
    data: {
      permissions: {
        only: [ROLES.ADMIN],
        redirectTo: '/',
      },
    },
  },
  {
    path: ':id/edit',
    component: EditComponent,
    data: {
      permissions: {
        only: [ROLES.ADMIN],
        redirectTo: '/',
      },
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalInfoRoutingModule {}
