import { ACTION_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const ReportsColumnDefs: GridColumns[] = [
  { field: 'id', headerName: 'Request No', maxWidth: 110, cellStyle: { textAlign: 'center' } },
  { field: 'name', headerName: 'Request Name' },
  {
    field: 'status',
    headerName: 'Request Status',
  },
  { field: 'user_name', headerName: 'Requested By' },
  { field: 'created_at', headerName: 'Requested Date' },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
    floatingFilter: false,
  },
];
