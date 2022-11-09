import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROLES } from '@shared/constants/constants';

const routes: Routes = [
  {
    path: 'survey_form',
    loadChildren: () =>
      import('@secure/survey-form/survey-list.module').then((module) => module.SurveyListModule),
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
export class SecureRoutingModule {}
