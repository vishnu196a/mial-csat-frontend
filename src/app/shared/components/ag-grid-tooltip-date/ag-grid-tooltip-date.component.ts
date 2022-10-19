import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';
import * as moment from 'moment';

@Component({
  templateUrl: './ag-grid-tooltip-date.component.html',
  styleUrls: ['./ag-grid-tooltip-date.component.scss'],
})
export class AgGridDateTooltipComponent implements ITooltipAngularComp {
  date: string;
  agInit(params: ITooltipParams): void {
    this.date = moment(params.value).format('DD-MM-YYYY hh:mm a');
  }
}
