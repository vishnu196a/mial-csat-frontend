import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface CategoryReportsList {
  category_reports: CategoryReportsDetails[];
  pagination: Pagination;
}

export interface CategoryReportsState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface CategoryReportsDetails {
  count: number;
  id: number;
  name: string;
  percentage: number;
}
