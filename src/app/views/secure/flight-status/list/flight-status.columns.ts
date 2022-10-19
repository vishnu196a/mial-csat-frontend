import { GridColumns } from '@shared/models/shared.model';

export const FlightStatusColumnDefs: GridColumns[] = [
  {
    field: 'airline_code',
    headerName: 'Airline Code',
    sortable: true,
    pinned: 'left',
  },
  {
    field: 'flight_number',
    headerName: 'Flight No',
    sortable: true,
    floatingFilter: false,
    pinned: 'left',
  },
  {
    field: 'flight_name',
    headerName: 'Airline',
    sortable: true,
    floatingFilter: false,
    pinned: 'left',
  },
  {
    field: 'operational_status_description',
    headerName: 'Operational Status',
    sortable: true,
  },
  {
    field: 'public_terminal_name',
    headerName: 'Terminal',
    sortable: true,
  },
  {
    field: 'departure_airport_name',
    headerName: 'Origin',
    sortable: true,
    floatingFilter: false,
  },
  {
    field: 'arrival_airport_name',
    headerName: 'Destination',
    sortable: true,
    floatingFilter: false,
  },
  {
    field: 'scheduled_departure_time',
    headerName: 'Scheduled Time',
    sortable: true,
    floatingFilter: false,
  },
  {
    field: 'estimated_departure_time',
    headerName: 'Estimated Time',
    sortable: true,
    floatingFilter: false,
  },
  {
    field: 'actual_departure_time',
    headerName: 'Actual Time',
    sortable: true,
    floatingFilter: false,
  },
  {
    field: 'scheduled_arrival_time',
    headerName: 'Scheduled Time',
    sortable: true,
    floatingFilter: false,
  },
  {
    field: 'estimated_arrival_time',
    headerName: 'Estimated Time',
    sortable: true,
    floatingFilter: false,
  },
  {
    field: 'actual_arrival_time',
    headerName: 'Actual Time',
    sortable: true,
    floatingFilter: false,
  },
  { field: 'gate_name', headerName: 'Gate', sortable: true },
  { field: 'belt_name', headerName: 'Belt', sortable: true },
  { field: 'check_in_counter', headerName: 'Check-in Counter', floatingFilter: false },
  { field: 'service_type_desc', headerName: 'Service Type', sortable: true },

  { field: 'updated_dt', headerName: 'Last Updated', sortable: true },
  { field: 'flight_schedule_id', headerName: 'Flight Schedule Id', sortable: true },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    floatingFilter: false,
  },
];
