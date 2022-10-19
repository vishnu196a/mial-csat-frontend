import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface Columns {
  Feedback?: string;
  'Call flow'?: string;
  'Call type'?: string;
  'Agent name'?: string;
  'Caller name'?: string;
  'Call log no'?: string;
  'Ringing time'?: string;
  'Picking time'?: string;
  'Feedback doj'?: string;
  'In queue time'?: string;
  'Caller address'?: string;
  'Call log status'?: string;
  'Caller email id'?: string;
  'Call answer desc'?: string;
  'Caller called no'?: string;
  'Feedback subject'?: string;
  'Emergency subject'?: string;
  'Feedback email id'?: string;
  'Caller contact no'?: string;
  'Call sub category'?: string;
  'Emergency comments'?: string;
  'Call log date time'?: string;
  'Call question desc'?: string;
  'Call category name'?: string;
  'Feedback responded'?: string;
  'Feedback flight info'?: string;
  'Feedback to be respond'?: string;
  'Emergency department id'?: string;
}

export interface ReportColumns {
  columns: Columns;
  filters: Filters;
}
export interface DynamicReportForm {
  name: string;
  payload: ReportColumns;
}
export interface Filters {
  Agent?: string;
  'Call Category'?: string;
  'Call Source'?: string;
  'Call Sub Category'?: string;
  'From Date'?: string;
  Status?: string;
  'To Date'?: string;
  'call type'?: string;
  'Mode of call'?: string;
}
export interface FilterValues {
  created_by?: string;
  category_id?: string;
  type?: string;
  sub_category_id?: string;
  from?: string;
  status?: string;
  to?: string;
  agent?: string;
  call_type?: string;
  mode_of_call?: string;
}

export interface Reports {
  id: number;
  name: string;
  status: string;
  user_id: number;
  user_name: string;
  created_at: string;
  updated_at: string;
  report_download_link: string;
}
export interface ReportsList {
  download_queues: Reports[];
  pagination: Pagination;
}
export interface ReportsState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface StaticReports {
  pagination: Pagination;
  manager_reports: ManageReport[];
}

export interface ManageReport {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  handler_name: string;
  payload: Columns;
  filters: Filters;
}

export interface SavedTemplates {
  pagination: Pagination;
  dynamic_report_templates: TemplateList[];
}

export interface TemplateList {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  payload: ReportColumns;
}

export interface DownloadStatic {
  filters: FilterValues;
}

export interface TemplateListState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}
