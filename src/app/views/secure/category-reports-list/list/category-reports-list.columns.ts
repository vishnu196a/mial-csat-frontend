import { ACTION_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const CategoryReportsColumnDefs: GridColumns[] = [
  { field: 'name', headerName: 'Name', sortable: true },
  { field: 'count', headerName: 'Count', floatingFilter: false, sortable: true },
  { field: 'percentage', headerName: 'Percentage', floatingFilter: false },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    floatingFilter: false,
    maxWidth: ACTION_WIDTH,
  },
];
