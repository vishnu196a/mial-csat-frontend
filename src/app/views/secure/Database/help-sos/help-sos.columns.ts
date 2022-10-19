import { ACTION_WIDTH, ROLES } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const SOSColumnDefs: GridColumns[] = [
  { field: 'type', headerName: 'Name', floatingFilter: false },
  { field: 'extension', headerName: 'Extension' },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
    floatingFilter: false,
    roles: [ROLES.ADMIN],
  },
];
