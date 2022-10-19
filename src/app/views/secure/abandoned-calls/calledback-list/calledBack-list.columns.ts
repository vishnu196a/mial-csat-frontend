import { NAME_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const CalledBackColumnDefs: GridColumns[] = [
  { field: 'contact_number', headerName: 'Contact Number', maxWidth: NAME_WIDTH },

  { field: 'type_of_called_back_queue', headerName: 'Type of call', maxWidth: NAME_WIDTH },
  {
    field: 'date_and_time',
    headerName: 'Date and Time',
    maxWidth: NAME_WIDTH,
    floatingFilter: false,
  },
  { field: 'call_reference_number', headerName: 'Call Ref No', maxWidth: NAME_WIDTH },

  { field: 'reason', headerName: 'Reason', maxWidth: NAME_WIDTH, floatingFilter: false },
];
