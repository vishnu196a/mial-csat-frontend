import { NAME_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const reportsColumnDef: GridColumns[] = [
  {
    field: 'survey_form_name',
    headerName: 'Form Name',
    maxWidth: NAME_WIDTH,
    floatingFilter: false,
  },
  { field: 'user_name', headerName: 'Agent Name', maxWidth: NAME_WIDTH },
  {
    field: 'no_of_feedback',
    headerName: 'No of feedbacks',
    maxWidth: NAME_WIDTH,
    floatingFilter: false,
  },
  {
    field: 'score_percentage',
    headerName: 'Score (%)',
    maxWidth: NAME_WIDTH,
    floatingFilter: false,
  },
];
