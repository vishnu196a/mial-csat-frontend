import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface TerminalInfoResponse {
  id: number;
  terminal_id: number;
  terminal_name: string;
  location: string;
  category: string;
  shop_name: string;
  description: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface TerminalInfoState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface TerminalInfoList {
  terminal_informations: TerminalInfoResponse[];
  pagination: Pagination;
}

export interface MessageResponse {
  message: string;
}
export interface TerminalInfoForm {
  shop_name: string;
  phone: string;
  email: string;
  location: string;
  category: string;
  description: string;
  terminal_id: number;
}

export type TerminalInfo = TerminalInfoForm & { id: string; terminal_name: string };
