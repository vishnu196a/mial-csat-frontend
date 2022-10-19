import { Component } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { NoRowsOverlayParams } from './ag-grid-no-rows-overlay.model';

@Component({
  templateUrl: './ag-grid-no-rows-overlay.component.html',
})
export class AgGridNoRowsOverlayComponent implements ILoadingOverlayAngularComp {
  params: NoRowsOverlayParams;

  agInit(params: NoRowsOverlayParams): void {
    this.params = params;
  }
}
