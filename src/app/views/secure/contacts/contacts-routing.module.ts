import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContactsComponent } from './add/add.component';
import { EditContactComponent } from './edit/edit.component';
import { ContactsComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: ContactsComponent },
  { path: 'new', component: AddContactsComponent },
  { path: ':id/edit', component: EditContactComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
