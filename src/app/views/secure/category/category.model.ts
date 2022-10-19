import { Pagination } from '@shared/models/shared.model';

export interface Category {
  name: string;
}
export interface CategoryResponse {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryState {
  pagination: Pagination;
  globalSearch: string;
}

export interface CategoryList {
  categories: CategoryResponse[];
  pagination: Pagination;
}

export interface MessageResponse {
  message: string;
}
