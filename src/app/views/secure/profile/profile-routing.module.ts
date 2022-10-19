import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from '@secure/profile/change-password/change-password.component';
import { ViewProfileComponent } from './view/view.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ViewProfileComponent,
  },
  {
    path: 'change_password',
    component: ChangePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
