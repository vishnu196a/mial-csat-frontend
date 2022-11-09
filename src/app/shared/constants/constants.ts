import { Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Role } from '@shared/models/shared.model';

export const REGEX_PATTERNS = {
  email: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$',
  mobile: '[6789][0-9]{9}',
  decimal: '^\\d{1,2}(.\\d{1,2})?$',
};

export const GLOBAL_SEARCH_DELAY = 1000;

export const LOADER_TIMEOUT = 2000;
export const S_NO_WIDTH = 70;
export const NAME_WIDTH = 1100;
export const ACTION_WIDTH = 250;

export const LIST_NO_OF_ROWS_OPTIONS = [5, 10, 15, 20];

export const APP_ROUTES = { defaultHomePage: '/users' };

export enum ROLES {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
}

export const USER_ROLES = [
  {
    name: Role.superAdmin,
    value: Role.superAdmin,
  },
  {
    name: Role.agent,
    value: Role.agent,
  },
];

export enum PERMISSION_LIST {
  canViewDashboard = 'canViewDashboard',
  canAddUser = 'canAddUser',
  canEditUser = 'canEditUser',
  canDeleteUser = 'canDeleteUser',
  canViewProfileParentName = 'canViewProfileParentName',
  canViewCategory = 'CanViewCategory',
  canViewSurveyForm = 'CanViewSurveyForm',
  canEditCategory = 'canEditCategory',
  canDeleteCategory = 'canDeleteCategory',
  canEditSubCategory = 'canEditSubCategory',
  canDeleteSubCategory = 'canDeleteSubCategory',
  canViewContacts = 'canViewContacts',
  canAddContacts = 'canAddContacts',
  canViewSurveyFormResponse = 'canViewSurveyFormRespose',
  canAddSurveyForm = 'canAddSurveyForm',
  canViewCategoryReports = 'CanViewCategoryReports',
  canViewContent = 'canViewContent',
  canViewTerminal = 'canViewTerminal',
  canAddTerminal = 'canAddTerminal',
  canDeleteContact = 'canDeleteContact',
  canEditContact = 'canEditContact',
  canViewTagHistory = 'canViewTagHistory',
  canEditTerminalInfo = 'canEditTerminalInfo',
  canDeleteTerminalInfo = 'canDeleteTerminalInfo',
  canAddTerminalInfo = 'canAddTerminalInfo',
}

export const PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSION_LIST.canViewDashboard,
    PERMISSION_LIST.canAddUser,
    PERMISSION_LIST.canEditUser,
    PERMISSION_LIST.canDeleteUser,
    PERMISSION_LIST.canEditCategory,
    PERMISSION_LIST.canDeleteCategory,
    PERMISSION_LIST.canViewCategory,
    PERMISSION_LIST.canViewSurveyForm,
    PERMISSION_LIST.canEditSubCategory,
    PERMISSION_LIST.canDeleteSubCategory,
    PERMISSION_LIST.canViewContacts,
    PERMISSION_LIST.canAddContacts,
    PERMISSION_LIST.canViewSurveyFormResponse,
    PERMISSION_LIST.canAddSurveyForm,
    PERMISSION_LIST.canViewCategoryReports,
    PERMISSION_LIST.canViewContent,
    PERMISSION_LIST.canViewTerminal,
    PERMISSION_LIST.canAddTerminal,
    PERMISSION_LIST.canEditContact,
    PERMISSION_LIST.canDeleteContact,
    PERMISSION_LIST.canViewTagHistory,
    PERMISSION_LIST.canEditTerminalInfo,
    PERMISSION_LIST.canDeleteTerminalInfo,
    PERMISSION_LIST.canAddTerminalInfo,
  ],
  [ROLES.AGENT]: [
    PERMISSION_LIST.canViewDashboard,
    PERMISSION_LIST.canViewProfileParentName,
    PERMISSION_LIST.canViewCategory,
    PERMISSION_LIST.canViewContent,
    PERMISSION_LIST.canViewContacts,
    PERMISSION_LIST.canViewTagHistory,
  ],
};

export const EDITER_CONFIG: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: '50rem',
  minHeight: '5rem',
  placeholder: 'Enter text here...',
  translate: 'no',
  defaultParagraphSeparator: 'p',
  defaultFontName: 'Arial',
  sanitize: false,
  toolbarHiddenButtons: [['insertVideo']],
};

export const EDITER_CONFIG_VIEW: AngularEditorConfig = {
  editable: false,
  spellcheck: true,
  showToolbar: false,
  height: 'auto',
  minHeight: '5rem',
  placeholder: 'Enter text here...',
  translate: 'no',
  defaultParagraphSeparator: 'p',
  defaultFontName: 'Arial',
};

export const SURVEY_TYPES = ['Options', 'Ratings', 'Multi Select', 'Free Text'];
export const SURVEY_OPTIONS = ['Yes', 'No'];
export const SURVEY_RATINGS = [5, 10];
export const FORM_STATUS_COLOUR = {
  Active: '#4dbd74',
  InActive: '#f86c6b',
};

export const SURVEY_DEFAULT_QUESTIONS = [
  {
    id: [1],
    question: [
      'Was your experience with our Customer Service Agent pleasant?',
      [Validators.required],
    ],
    type: ['Ratings'],
    option: [null],
    ratings: [5],
    multi_select: [],
    dependent_questions: [null],
    optionText: [null],
    multiOptionText: [null],
  },
  {
    id: [2],
    question: [
      'Basis your experience how likely are you to recommend CSMIA to your friends/colleagues/family?',
      [Validators.required],
    ],
    type: ['Ratings'],
    option: [null],
    ratings: [10],
    multi_select: [],
    dependent_questions: [null],
    optionText: [null],
    multiOptionText: [null],
  },
];
