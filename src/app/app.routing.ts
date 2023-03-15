import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SurveyFormComponent } from 'src/app/views/survey-form/survey-form.component';

// Import Containers

export const routes: Routes = [
  {
    path: 'fb',
    component: SurveyFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
