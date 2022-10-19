import { GridColumns } from '@shared/models/shared.model';

export const StaticReportColumnDefs: GridColumns[] = [
  { field: 'name', headerName: 'Report Name' },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: 100,
    floatingFilter: false,
  },
];
