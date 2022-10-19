import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface AbandonedCallsList {
  abandoned_calls: Calls[];
  pagination: Pagination;
}
export interface Calls {
  id: number;
  contact_number: string;
  date_and_time: string;
  call_reference_number: string;
}

export interface CallsState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface CallBackList {
  call_back_queues: Calls[];
  pagination: Pagination;
}
export interface CalledBackList {
  called_back_queues: CalledBack[];
  pagination: Pagination;
}
export interface CalledBack {
  id: number;
  reason: string;
  contact_number: string;
  date_and_time: string;
  type_of_called_back_queue: string;
  call_reference_number: string;
}

export interface CallDetails {
  id: string;
  language: string;
  caller_id: string;
  caller_name: string;
  call_entry_id: number;
}
