import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SurveyListRoutingModule } from './survey-list-routing.module';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { SurveyListComponent } from './list/list.component';
import { AddFormComponent } from './add/add.component';
import { ViewComponent } from './view/view.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReportListComponent } from './report-list/report-list.component';

@NgModule({
  declarations: [SurveyListComponent, AddFormComponent, ViewComponent, ReportListComponent],
  imports: [CommonModule, SurveyListRoutingModule, SharedModule, GridModule, NgbModule],
})
export class SurveyListModule {}
