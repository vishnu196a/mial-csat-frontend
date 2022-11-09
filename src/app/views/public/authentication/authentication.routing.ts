import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyFormComponent } from '@public/survey-form/survey-form.component';

const routes: Routes = [
  {
    path: '',
    children: [{ path: 'survey_form_invitation', component: SurveyFormComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
