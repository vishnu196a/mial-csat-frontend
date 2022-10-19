import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridActionsComponent } from '@shared/components/ag-grid-actions/ag-grid-actions.component';
import { AgGridLoadingOverlayComponent } from '@shared/components/ag-grid-loading-overlay/ag-grid-loading-overlay.component';
import { AgGridNoRowsOverlayComponent } from '@shared/components/ag-grid-no-rows-overlay/ag-grid-no-rows-overlay.component';
import { AgGridDateTooltipComponent } from '@shared/components/ag-grid-tooltip-date/ag-grid-tooltip-date.component';
import { AgGridComponent } from '@shared/components/ag-grid/ag-grid.component';
import { DeleteComponent } from '@shared/components/delete/delete.component';
import { AgGridModule } from 'ag-grid-angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FloatingFilterComponent } from '../components/floating-filter/floating-filter.component';

@NgModule({
  declarations: [
    AgGridActionsComponent,
    AgGridDateTooltipComponent,
    AgGridNoRowsOverlayComponent,
    AgGridLoadingOverlayComponent,
    AgGridComponent,
    DeleteComponent,
    FloatingFilterComponent,
  ],
  imports: [
    CommonModule,
    AgGridModule,
    FormsModule,
    ModalModule.forRoot(),
    NgxPermissionsModule.forChild(),
  ],
  exports: [AgGridComponent],
})
export class GridModule {}
