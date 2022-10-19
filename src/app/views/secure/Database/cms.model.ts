import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface CMS {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  created_by_id: number;
  created_by_name: string;
}
export type CmsView = CMS & { type: string; content: string };

export interface CmsState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface CmsList {
  content_management_system: CMS[];
  pagination: Pagination;
}

export interface AddContent {
  title: string;
  content: string;
}

export type AddContentResponse = AddContent & {
  id: number;
  created_at: string;
  updated_at: string;
};

export interface NameAndId {
  id: string;
  name: string;
}
export interface IdAndDesc {
  id: string;
  description: string;
}
export interface Sos {
  id: number;
  type: string;
  extension: string;
}

export interface SosForm {
  type: string;
  extension: string;
}

export interface SosList {
  extensions_types: Sos[];
  pagination: Pagination;
}

export interface SosState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}
