import { ACTION_WIDTH, NAME_WIDTH, ROLES } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const UserColumnDefs: GridColumns[] = [
  { field: 'name', headerName: 'Name', maxWidth: NAME_WIDTH },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    roles: [ROLES.ADMIN],
    maxWidth: ACTION_WIDTH,
  },
];
