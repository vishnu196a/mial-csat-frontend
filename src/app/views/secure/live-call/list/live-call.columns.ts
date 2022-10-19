import { ACTION_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const LiveCallColumnDefs: GridColumns[] = [
  { field: 'caller_id', headerName: 'Caller Number' },
  { field: 'caller_name', headerName: 'Caller Name' },
  { field: 'call_reference_number', headerName: 'Call Ref No' },
  { field: 'call_duration_in_minutes', headerName: 'Call duration(min)' },
  { field: 'datetime_init', headerName: 'Date and Time' },
  { field: 'language', headerName: 'Language' },
  { field: 'call_type', headerName: 'Call type' },

  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
  },
];
