import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyInvitationListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyInvitationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyInvitationListRoutingModule {}
