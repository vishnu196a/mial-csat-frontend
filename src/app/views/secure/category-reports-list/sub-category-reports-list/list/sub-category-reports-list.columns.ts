import { GridColumns } from '@shared/models/shared.model';

export const SubCategoryReportsColumnDefs: GridColumns[] = [
  { field: 'name', headerName: 'Name', sortable: true },
  { field: 'count', headerName: 'Count', floatingFilter: false, sortable: true },
  { field: 'percentage', headerName: 'Percentage', floatingFilter: false },
];
