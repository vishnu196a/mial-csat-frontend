import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface TerminalResponse {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface Terminal {
  name: string;
}
export interface TerminalState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface TerminalList {
  terminals: TerminalResponse[];
  pagination: Pagination;
}

export interface MessageResponse {
  message: string;
}
