import { ACTION_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const TerminalColumnDefs: GridColumns[] = [
  { field: 'name', headerName: 'Name' },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    floatingFilter: false,
    maxWidth: ACTION_WIDTH,
  },
];
