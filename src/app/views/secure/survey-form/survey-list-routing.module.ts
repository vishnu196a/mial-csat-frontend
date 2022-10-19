import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFormComponent } from './add/add.component';
import { SurveyListComponent } from './list/list.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyListComponent,
  },
  {
    path: 'new',
    component: AddFormComponent,
  },
  {
    path: ':id',
    component: ViewComponent,
  },
  {
    path: 'report/:id',
    component: ReportListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyListRoutingModule {}
