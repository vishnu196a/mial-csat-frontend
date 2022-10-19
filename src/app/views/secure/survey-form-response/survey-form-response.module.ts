import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { SurveyFormResponseListComponent } from './list/list.component';
import { SurveyFormResponseRoutingModule } from './survey-form-response-routing.module';
import { ViewComponent } from './view/view.component';

@NgModule({
  declarations: [SurveyFormResponseListComponent, ViewComponent],
  imports: [CommonModule, SurveyFormResponseRoutingModule, GridModule, SharedModule, NgbModule],
})
export class SurveyFormResponseModule {}
