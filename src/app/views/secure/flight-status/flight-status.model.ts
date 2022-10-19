import { FloatingFilterSearchData, Pagination } from '@shared/models/shared.model';

export interface FlightStatusResponse {
  flight_schedule_id: number;
  flight_number: string;
  updated_dt: string;
  airline_code: string;
  operational_status: string;
  estimated_arrival_time: string;
  scheduled_arrival_time: string;
  scheduled_departure_time: string;
  estimated_departure_time: string;
  gate_name: string;
  created_dt: string;
  flight_type: string;
  schedule_type: string;
  arrival_airport_name: string;
  departure_airport_name: string;
  operational_status_description: string;
  service_type_desc: string;
  belt_name: string;
  flight_name: string;
  actual_arrival_time: string;
  public_terminal_name: string;
  actual_departure_time: string;
  check_in_counter: string;
}

export interface GetUser extends FlightStatusResponse {
  name: string;
}
export interface FlightStatusState {
  pagination: Pagination;
  globalSearch: string;
  columns: FloatingFilterSearchData;
}

export interface FlightStatusList {
  flight_status: FlightStatusResponse[];
  pagination: Pagination;
}

export interface FlightStatusDetails {
  stand_bay: string;
  created_by: string;
  updated_by: string;
  created_dt: string;
  delay_code: string;
  updated_dt: string;
  flight_type: string;
  code_context: string;
  airline_code: string;
  service_type: string;
  terminal_name: string;
  flight_number: string;
  schedule_type: string;
  aodb_flight_id: number;
  special_action: string;
  delay_duration: string;
  arrival_airport: string;
  remark_text_code: string;
  remark_free_text: string;
  origin_date_time: string;
  departure_airport: string;
  operational_suffix: string;
  operational_status: string;
  flight_schedule_id: number;
  actual_arrival_time: string;
  flight_schedule_type: string;
  public_terminal_name: string;
  actual_departure_time: string;
  scheduled_arrival_time: string;
  estimated_arrival_time: string;
  scheduled_departure_time: string;
  estimated_departure_time: string;
  gate_name: string;
  operational_status_description: string;
  service_type_desc: string;
  boarding_time: string;
  gate_open_time: string;
  gate_close_time: string;
  ten_miles_out_time: string;
  final_boarding_time: string;
  actual_take_off_time: string;
  actual_touchdown_time: string;
  last_bag_unloaded_time: string;
  first_bag_unloaded_time: string;
  belt_name: string;
  belt_type: string;
  belt_location: string;
  check_in_counter: string;
}
