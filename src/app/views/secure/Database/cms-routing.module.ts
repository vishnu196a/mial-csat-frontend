import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddContentComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { AddSOSComponent } from './help-sos/add/add.component';
import { EditSosComponent } from './help-sos/edit/edit.component';
import { HelpSosComponent } from './help-sos/help-sos.component';
import { CmsListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: CmsListComponent },
  { path: 'helpSOS', component: HelpSosComponent },
  { path: 'new', component: AddContentComponent },
  { path: ':id', component: ViewComponent },
  { path: ':id/edit', component: EditComponent },
  { path: 'helpSOS/new_helpSOS', component: AddSOSComponent },
  { path: 'helpSOS/:id/edit_helpSOS', component: EditSosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMSRoutingModule {}
