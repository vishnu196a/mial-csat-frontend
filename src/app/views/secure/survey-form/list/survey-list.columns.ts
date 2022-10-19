import { ACTION_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const SurveyColumnDefs: GridColumns[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'created_by_name', headerName: 'Created By' },
  { field: 'updated_by_name', headerName: 'Updated By' },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    floatingFilter: false,
    maxWidth: ACTION_WIDTH,
  },
];
