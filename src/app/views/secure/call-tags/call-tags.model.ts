import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface CallTags {
  id: number;
  answer: string;
  question: string;
  created_by_id: number;
  created_by_name: string;
  category_id: number;
  category_name: string;
  sub_category_id: number;
  sub_category_name: string;
  caller_name: string;
  contact_number: string;
  created_at: string;
  updated_at: string;
  call_tag_type: string;
  call_duration: string;
  call_answer_time: string;
  date_and_time: string;
  call_reference_number: string;
}

export type CallTagDetails = Omit<CallTags, 'created_by_id' | 'created_by_name'> & {
  user_id: number;
  user_name: string;
  created_by: string;
};

export interface CallTagsList {
  call_tags: CallTags[];
  pagination: Pagination;
}

export interface CallTagsState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}
