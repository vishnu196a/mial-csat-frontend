import { ACTION_WIDTH, ROLES } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const TerminalInfoColumnDefs: GridColumns[] = [
  { field: 'terminal_name', headerName: 'Terminal' },
  { field: 'location', headerName: 'Location' },
  { field: 'category', headerName: 'Category' },
  { field: 'shop_name', headerName: 'Shop Name' },
  { field: 'description', headerName: 'Description' },
  { field: 'phone', headerName: 'Phone' },
  { field: 'email', headerName: 'Email' },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    floatingFilter: false,
    maxWidth: ACTION_WIDTH,
    roles: [ROLES.ADMIN],
  },
];
