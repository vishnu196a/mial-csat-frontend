import { Component } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { ILoadingOverlayParams } from 'ag-grid-community';

@Component({
  templateUrl: './ag-grid-loading-overlay.component.html',
})
export class AgGridLoadingOverlayComponent implements ILoadingOverlayAngularComp {
  params: ILoadingOverlayParams;

  agInit(params: ILoadingOverlayParams): void {
    this.params = params;
  }
}
