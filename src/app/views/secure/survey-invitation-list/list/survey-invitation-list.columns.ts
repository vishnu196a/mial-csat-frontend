import { ACTION_WIDTH } from '@shared/constants/constants';
import { GridColumns } from '@shared/models/shared.model';

export const SurveyInvitationColumnDefs: GridColumns[] = [
  { field: 'call_id', headerName: 'Call Id' },
  { field: 'survey_form_name', headerName: 'Form Name' },
  { field: 'type', headerName: 'Type' },
  { field: 'resent_by_name', headerName: 'Last Resent By' },
  { field: 'contact', headerName: 'Contact' },
  { field: 'status', headerName: 'Status', floatingFilter: false },

  { field: 'invitation_url', headerName: 'Invitation Link', floatingFilter: false },
  {
    headerName: 'Actions',
    cellRenderer: 'actionRenderer',
    pinned: 'right',
    maxWidth: ACTION_WIDTH,
    floatingFilter: false,
  },
];
