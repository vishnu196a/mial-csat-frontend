import { ROLES } from '@shared/constants/constants';
import { NavItems } from '@shared/models/shared.model';

export const navItems: NavItems[] = [
  {
    name: 'Live Call',
    url: '/live_call',
    iconPath: 'assets/nav-icon/live-call.svg',
  },
  {
    name: 'Abandoned Calls',
    url: '/abandoned_calls',
    iconPath: 'assets/nav-icon/abandoned_call.svg',
    roles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    name: 'Call Tags',
    url: '/call_tags',
    iconPath: 'assets/nav-icon/call-tags.png',
    roles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    name: 'Flight Status',
    url: '/flight_status',
    iconPath: 'assets/nav-icon/FlightStatus.svg',
    roles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    name: 'Database',
    url: '/database',
    iconPath: 'assets/nav-icon/contentManagement.svg',
    roles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    name: 'Terminal Informations',
    url: '/terminal_info',
    iconPath: 'assets/nav-icon/terminal_Info.svg',
    roles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    name: 'Contacts',
    url: '/contacts',
    iconPath: 'assets/nav-icon/contact_icon.svg',
    roles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    name: 'Categories',
    url: '/categories',
    iconPath: 'assets/nav-icon/category.svg',
    roles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    name: 'Terminal Locations',
    url: '/terminals',
    iconPath: 'assets/nav-icon/terminal.svg',
    roles: [ROLES.ADMIN],
  },
  {
    name: 'Survey Forms',
    url: '/survey_form',
    iconPath: 'assets/nav-icon/survey_list.svg',
    roles: [ROLES.ADMIN],
  },
  {
    name: 'Survey Invitations',
    url: '/survey_invitation',
    iconPath: 'assets/nav-icon/invitation_link.svg',
    roles: [ROLES.ADMIN],
  },
  {
    name: 'Survey Responses',
    url: '/survey_form_response',
    iconPath: 'assets/nav-icon/surveyFormResponse.svg',
    roles: [ROLES.ADMIN],
  },
  {
    name: 'Reports',
    url: '/category_reports',
    iconPath: 'assets/nav-icon/category-reports.svg',
    roles: [ROLES.ADMIN],
  },
  {
    name: 'Report Management',
    url: '/reports',
    iconPath: 'assets/nav-icon/reports_Management.svg',
    roles: [ROLES.ADMIN, ROLES.AGENT],
  },
  {
    name: 'Users',
    url: '/users',
    iconPath: 'assets/nav-icon/users.svg',
    roles: [ROLES.ADMIN],
  },
];
