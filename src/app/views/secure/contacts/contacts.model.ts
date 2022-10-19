import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface Contacts {
  id: number;
  name: string;
  email: string;
  phone: string;
  category_id: number;
  category_name: string;
  created_by_id: number;
  sub_category_id: number;
  created_by_name: string;
  sub_category_name: string;
  terminal_id: number;
  terminal_name: string;
  landline_number: string;
}

export interface ContactsState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface ContactsList {
  contacts: Contacts[];
  pagination: Pagination;
}

export interface RolesList {
  id: number;
  name: string;
}

export interface NameAndId {
  id: number;
  name: string;
}

export interface ContactsResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  category_id: number;
  category_name: string;
  created_by_id: number;
  sub_category_id: number;
  created_by_name: string;
  sub_category_name: string;
  terminal_id: number;
  terminal_name: string;
  landline_number: string;
}

export interface ContactsForm {
  category_id: string;
  sub_category_id: string;
  name: string;
  email: string;
  phone: string;
  terminal_id: number;
  landline_number: string;
}
