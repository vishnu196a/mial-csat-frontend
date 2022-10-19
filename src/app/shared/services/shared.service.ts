import { Injectable } from '@angular/core';
import moment from 'moment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  apiUrl = environment.apiUrl;
  constructor() {}

  getRelativeDate(date: string): string {
    return moment(date).fromNow();
  }

  getFormattedDate(date: string): string {
    return date ? moment.utc(date).format('DD-MM-YYYY HH:mm') : '-';
  }

  getFormattedDateNull(date: string | number): string {
    return date ? moment.utc(date).format('DD-MM-YYYY HH:mm') : '';
  }

  getFormattedDateOnly(date: string): string {
    return date.split('T')[0];
  }
  getIstFormattedDate(date: string): string {
    return date ? moment(date).utcOffset(330).format('DD-MM-YYYY HH:mm') : '-';
  }
  getReportFilterDate(date: string): string {
    return date ? moment.utc(date).format('YYYY-MM-DD HH:mm') : '';
  }
}
