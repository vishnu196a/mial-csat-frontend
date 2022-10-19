import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { DynamicReportsComponent } from './dynamic-reports/dynamic-reports.component';
import { ReportRecordsComponent } from './report-records/report-records.component';
import { ReportsComponent } from './reports/reports.component';
import { GridModule } from '@shared/modules/grid.module';
import { SharedModule } from '@shared/shared.module';
import { ManageReportsComponent } from './manage-reports/manage-reports.component';
import { FilterComponentComponent } from './manage-reports/filter-component/filter-component.component';
import { TemplateListComponent } from './dynamic-reports/template-list/template-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    DynamicReportsComponent,
    ReportRecordsComponent,
    ReportsComponent,
    ManageReportsComponent,
    FilterComponentComponent,
    TemplateListComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    GridModule,
    NgMultiSelectDropDownModule,
  ],
})
export class ReportsModule {}
