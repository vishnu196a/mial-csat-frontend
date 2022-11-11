import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AgGridModule,
    FormsModule,
    ModalModule.forRoot(),
    NgxPermissionsModule.forChild(),
  ],
  exports: [],
})
export class GridModule {}
