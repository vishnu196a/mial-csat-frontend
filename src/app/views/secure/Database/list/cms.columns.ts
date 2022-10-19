import { ACTION_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const CmsColumnDefs: GridColumns[] = [
  { field: 'title', headerName: 'Title' },
  { field: 'created_by_name', headerName: 'Created By' },

  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
    floatingFilter: false,
  },
];
