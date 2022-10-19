import { GridColumns } from '@shared/models/shared.model';

export const UserColumnDefs: GridColumns[] = [
  { field: 'name', headerName: 'Name' },
  { field: 'employee_number', headerName: 'Emp No' },
  { field: 'mobile_no', headerName: 'Contact No' },
  { field: 'email', headerName: 'Email Id' },
  { field: 'agent_code', headerName: 'Agent Code' },
  { field: 'role', headerName: 'Rights' },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    floatingFilter: false,
  },
];
