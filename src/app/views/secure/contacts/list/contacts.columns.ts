import { ACTION_WIDTH, ROLES } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const ContactsColumnDefs: GridColumns[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'email', headerName: 'Email' },
  { field: 'phone', headerName: 'Phone' },
  { field: 'category_name', headerName: 'Category' },
  { field: 'sub_category_name', headerName: 'Sub-Category' },
  { field: 'landline_number', headerName: 'Landline' },
  { field: 'terminal_name', headerName: 'Terminal' },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
    floatingFilter: false,
    roles: [ROLES.ADMIN],
  },
];
