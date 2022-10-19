import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { AddUserComponent } from './add/add.component';
import { EditUserComponent } from './edit/edit.component';
import { UserListComponent } from './list/list.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [AddUserComponent, UserListComponent, EditUserComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule, GridModule],
})
export class UserModule {}
