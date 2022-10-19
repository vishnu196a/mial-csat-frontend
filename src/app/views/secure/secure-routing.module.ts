import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROLES } from '@shared/constants/constants';
import { AuthenticationGuard } from '@shared/guards/authentication.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: 'live_call',
    canActivate: [AuthenticationGuard, NgxPermissionsGuard],
    loadChildren: () =>
      import('@secure/live-call/live-call.module').then((module) => module.CallEntryModule),
    data: {
      permissions: {
        only: [ROLES.ADMIN, ROLES.AGENT],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'users',
    canActivate: [AuthenticationGuard, NgxPermissionsGuard],
    loadChildren: () => import('@secure/user/user.module').then((module) => module.UserModule),
    data: {
      permissions: {
        only: [ROLES.ADMIN],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('@secure/category/category.module').then((module) => module.CategoryModule),
    data: {
      permissions: {
        only: [ROLES.ADMIN, ROLES.AGENT],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'flight_status',
    loadChildren: () =>
      import('@secure/flight-status/flight-status.module').then(
        (module) => module.FlightStatusModule
      ),
    data: {
      permissions: {
        only: [ROLES.ADMIN, ROLES.AGENT],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'database',
    loadChildren: () => import('@secure/Database/cms.module').then((module) => module.CMSModule),
    data: {
      permissions: {
        only: [ROLES.ADMIN, ROLES.AGENT],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('@secure/contacts/contacts.module').then((module) => module.ContactsModule),
    data: {
      permissions: {
        only: [ROLES.ADMIN, ROLES.AGENT],
        redirectto: '/',
      },
    },
  },
  {
    path: 'terminals',
    loadChildren: () =>
      import('@secure/terminal/terminal.module').then((module) => module.TerminalModule),
    data: {
      permissions: {
        only: [ROLES.ADMIN],
        redirectto: '/',
      },
    },
  },
  {
    path: 'terminal_info',
    loadChildren: () =>
      import('@secure/terminal-info/terminal-info.module').then(
        (module) => module.TerminalInfoModule
      ),
    data: {
      permissions: {
        only: [ROLES.ADMIN, ROLES.AGENT],
        redirectto: '/',
      },
    },
  },
  {
    path: 'survey_form_response',
    loadChildren: () =>
      import('@secure/survey-form-response/survey-form-response.module').then(
        (module) => module.SurveyFormResponseModule
      ),
    data: {
      permissions: {
        only: [ROLES.ADMIN],
        redirectto: '/',
      },
    },
  },
  {
    path: 'survey_form',
    loadChildren: () =>
      import('@secure/survey-form/survey-list.module').then((module) => module.SurveyListModule),
    data: {
      permissions: {
        only: [ROLES.ADMIN],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'abandoned_calls',
    loadChildren: () =>
      import('@secure/abandoned-calls/abandoned-calls.module').then(
        (module) => module.AbandonedCallsModule
      ),
    data: {
      permissions: {
        only: [ROLES.ADMIN, ROLES.AGENT],
        redirectTo: '/',
      },
    },
  },

  {
    path: 'survey_invitation',
    loadChildren: () =>
      import('@secure/survey-invitation-list/survey-invitation-list.module').then(
        (module) => module.SurveyInvitationListModule
      ),
    data: {
      permissions: {
        only: [ROLES.ADMIN],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'category_reports',
    loadChildren: () =>
      import('@secure/category-reports-list/category-reports-list.module').then(
        (module) => module.CategoryReportsListModule
      ),
    data: {
      permissions: {
        only: [ROLES.ADMIN],
        redirectTo: '/',
      },
    },
  },
  {
    path: '',
    canActivate: [AuthenticationGuard],
    loadChildren: () =>
      import('@secure/profile/profile.module').then((module) => module.ProfileModule),
  },
  {
    path: 'call_tags',
    canActivate: [AuthenticationGuard, NgxPermissionsGuard],
    loadChildren: () =>
      import('@secure/call-tags/call-tags.module').then((module) => module.CallTagsModule),
    data: {
      permissions: {
        only: [ROLES.ADMIN, ROLES.AGENT],
        redirectTo: '/',
      },
    },
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('@secure/reports/reports.module').then((module) => module.ReportsModule),
    data: {
      permissions: {
        only: [ROLES.ADMIN, ROLES.AGENT],
        redirectTo: '/',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecureRoutingModule {}
