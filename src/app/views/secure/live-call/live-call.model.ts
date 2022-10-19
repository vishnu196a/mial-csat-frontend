import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface LiveCallList {
  id: number;
  language: string;
  call_type: string;
  caller_id: string;
  caller_name: string;
  call_tag_id: null | number;
  datetime_init: string;
  call_entry_id: string;
  already_tagged: boolean;
  total_calls_attended: number;
  total_abandoned_calls: number;
  call_reference_number: string;
  total_call_waiting_count: number;
  call_duration_in_minutes: string;
}

export type PreFillData = Omit<
  LiveCallList,
  'id' | 'call_type' | 'call_tag_id' | 'datetime_init' | 'call_duration_in_minutes'
>;

export interface CallTag {
  id: number;
  answer: string;
  question: string;
  category_id: number;
  caller_name: string;
  call_entry_id: number;
  sub_category_id: number;
  terminal_id: number | null;
  contact_number: string;
  mode_of_call: string;
  caller_email_id: string;
}

export type TagCall = Omit<CallTag, 'id'>;

export interface UntagedCalls {
  call_entry_id: number;
  language: string;
  caller_id: string;
  caller_name: string;
  call_tag_id: number;
  id_agent: number;
  datetime_init: string;
  already_tagged: true;
  duration: number;
  datetime_end: string;
  duration_wait: string;
}

export interface UntagCallList {
  untaged_call_entries: UntagedCalls[];
  pagination: Pagination;
}

export interface UntagCallState {
  pagination: Pagination;
  globalSearch: string;
}

export interface EmergencyCallResponse {
  id: number;
  subject: string;
  phone_no: string;
  email_id: string[];
  comments: string;
  department: string;
  call_entry_id: number;
  contact_person: string;
}
export interface BusinessForm {
  phone_no: string;
  email_id: string[];
  comments: string;
  call_entry_id: string;
  name: string;
  date: string;
  customer_email_id: string;
}

export type BusinessResponse = BusinessForm & {
  id: number;
};

export type EmergencyForm = Omit<EmergencyCallResponse, 'id'>;

export interface FeedbackCallResponse {
  id: number;
  subject: string;
  feedback: string;
  email_id: string[];
  responded: string;
  flight_info: string;
  caller_name: string;
  call_entry_id: string;
  date_of_journey: string;
  mail_to_feedback_team: boolean;
}

export type FeedbackForm = Omit<FeedbackCallResponse, 'id'>;

export interface RequestCallResponse {
  id: number;
  city: string;
  email: string;
  title: string;
  address: string;
  subject: string;
  telephone: string;
  mobile_no: string;
  last_name: string;
  first_name: string;
  postal_code: string;
  nationality: string;
  call_entry_id: number;
  date_of_birth: string;
  place_of_make: string;
  date_of_issue: string;
  meet_and_assist: string;
  passport_number: string;
  port_of_destination: string;
  mail_to_feedback_team: true;
  contact_person_email_id: string[];
}

export type RequestCallForm = Omit<RequestCallResponse, 'id'>;

export interface TagCallState {
  columns: FloatingFilterSearchData;
}

export interface ManualCallTag {
  callerid: string;
  id_queue_call_entry: number;
  caller_name: string;
  category_id: number;
  sub_category_id: number;
  terminal_id: string;
  caller_email_id: null | string;
  mode_of_call: string;
  question: string;
  answer: string;
  datetime_end: string;
  datetime_init: string;
  datetime_entry_queue: string;
}

export interface ManualCallResponse {
  id: number;
  mode: string;
  answer: string;
  question: string;
  caller_name: string;
  terminal_id: number;
  category_id: number;
  call_entry_id: number;
  caller_email_id: string | null;
  sub_category_id: number;
}
