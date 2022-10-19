import { ACTION_WIDTH, NAME_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const UserColumnDefs: GridColumns[] = [
  { field: 'name', headerName: 'Name', maxWidth: NAME_WIDTH },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
  },
];
