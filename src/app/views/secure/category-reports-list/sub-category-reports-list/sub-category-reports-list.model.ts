import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export class SubCategoryReports {
  id: number;
  name: string;
  count: number;
  percentage: number;
}

export interface SubCategoryReportsList {
  sub_category_reports: SubCategoryReports[];
  pagination: Pagination;
}

export interface SubCategoryReportsState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}
