import { ACTION_WIDTH, ROLES } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const CallTagsColumnDefs: GridColumns[] = [
  { field: 'call_reference_number', headerName: 'Call Ref No', floatingFilter: false },
  { field: 'caller_name', headerName: 'Caller Name' },
  { field: 'contact_number', headerName: 'Contact Number' },
  { field: 'category_name', headerName: 'Category' },
  { field: 'sub_category_name', headerName: 'Sub Category' },
  { field: 'call_tag_type', headerName: 'Call Type', floatingFilter: false },
  { field: 'date_and_time', headerName: 'Date and Time', floatingFilter: false, sortable: true },
  { field: 'call_duration', headerName: 'Call Duration', floatingFilter: false },
  { field: 'call_answer_time', headerName: 'Call Answer Time', floatingFilter: false },
  { field: 'created_by_name', headerName: 'Created by', roles: [ROLES.ADMIN] },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
    floatingFilter: false,
  },
];
