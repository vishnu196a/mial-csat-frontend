import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './list/list.component';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { AddContactsComponent } from './add/add.component';
import { EditContactComponent } from './edit/edit.component';

@NgModule({
  declarations: [AddContactsComponent, ContactsComponent, EditContactComponent],
  imports: [CommonModule, ContactsRoutingModule, GridModule, SharedModule],
})
export class ContactsModule {}
