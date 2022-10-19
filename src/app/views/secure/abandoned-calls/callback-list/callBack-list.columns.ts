import { ACTION_WIDTH, NAME_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const CallBackColumnDefs: GridColumns[] = [
  { field: 'contact_number', headerName: 'Contact Number', maxWidth: NAME_WIDTH },
  { field: 'date_and_time', headerName: 'Date and Time', floatingFilter: false },
  { field: 'call_reference_number', headerName: 'Call Ref No', floatingFilter: false },

  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
    floatingFilter: false,
  },
];
