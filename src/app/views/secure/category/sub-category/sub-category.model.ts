import { Pagination } from '@shared/models/shared.model';

export interface SubCategory {
  name: string;
}
export interface SubCategoryResponse {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface SubCategoryState {
  pagination: Pagination;
  globalSearch: string;
}

export interface SubCategoryList {
  sub_categories: SubCategoryResponse[];
  pagination: Pagination;
}
