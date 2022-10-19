import { ACTION_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const SurveyFormResponseColumnDefs: GridColumns[] = [
  { field: 'survey_form_name', headerName: 'Form Name' },
  { field: 'user_name', headerName: 'Agent Name' },
  {
    field: 'score',
    headerName: 'Score (%)',
    cellClass: 'ag-right-aligned-cell',
    floatingFilter: false,
  },

  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
    floatingFilter: false,
  },
];
