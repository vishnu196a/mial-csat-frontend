import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ViewProfileComponent } from './view/view.component';

@NgModule({
  declarations: [ViewProfileComponent, ChangePasswordComponent],
  imports: [CommonModule, ProfileRoutingModule, SharedModule],
})
export class ProfileModule {}
