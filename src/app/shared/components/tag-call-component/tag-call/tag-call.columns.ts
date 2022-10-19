import { ROLES } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const TagCallColumnDef: GridColumns[] = [
  { field: 'caller_name', headerName: 'Caller Name' },
  { field: 'contact_number', headerName: 'Contact Number' },
  { field: 'category_name', headerName: 'Category' },
  { field: 'sub_category_name', headerName: 'Sub Category' },
  { field: 'call_tag_type', headerName: 'Call Type', floatingFilter: false },
  { field: 'question', headerName: 'Question' },
  { field: 'answer', headerName: 'Answer' },
  { field: 'created_by_name', headerName: 'Created by', roles: [ROLES.ADMIN] },
];
