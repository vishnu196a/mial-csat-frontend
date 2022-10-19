import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagCallComponent } from '@shared/components/tag-call-component/tag-call/tag-call.component';
import { AddManualCallTagComponent } from './add/add.component';
import { LiveCallListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LiveCallListComponent,
  },
  {
    path: 'new',
    component: AddManualCallTagComponent,
  },
  {
    path: ':id/tag',
    component: TagCallComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallEntryRoutingModule {}
