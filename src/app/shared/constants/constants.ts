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

export const FLIGHT_DETAILS = {
  stand_bay: 'Stand Bay',
  delay_code: 'Delay Code',
  updated_dt: 'Updated Date',
  flight_type: 'Flight Type',
  code_context: 'Code Context',
  airline_code: 'Airline Code',
  service_type: 'Service Type',
  terminal_name: 'Terminal Name',
  flight_number: 'Flight Number',
  schedule_type: 'Schedule Type',
  special_action: 'Special Action',
  delay_duration: 'Delay Duration',
  arrival_airport: 'Arrival Airport',
  remark_text_code: 'Remark Text Code',
  remark_free_text: 'Remark Free Text',
  origin_date_time: 'Origin Date & Time',
  departure_airport: 'Departure Airport',
  operational_suffix: 'Operational Suffix',
  operational_status: 'Operational Status',
  actual_arrival_time: 'Actual Arrival Time',
  flight_schedule_type: 'Flight Schedule Type',
  public_terminal_name: 'Public Terminal Name',
  actual_departure_time: 'Actual Departure Time',
  scheduled_arrival_time: 'Scheduled Arrival Time',
  estimated_arrival_time: 'Estimated Arrival Time',
  scheduled_departure_time: 'Scheduled Departure Time',
  estimated_departure_time: 'Estimated Departure Time',
  gate_name: 'Gate Name',
  operational_status_description: 'Operational Status Description',
  service_type_desc: 'Service Type Description',
  boarding_time: 'Boarding Time',
  gate_open_time: 'Gate Open Time',
  gate_close_time: 'Gate Close Time',
  ten_miles_out_time: 'Ten Miles Out Time',
  final_boarding_time: 'Final Boarding Time',
  actual_take_off_time: 'Actual Take Off Time',
  actual_touchdown_time: 'Actual Touchdown Time',
  last_bag_unloaded_time: 'Last Bag Unloaded Time',
  first_bag_unloaded_time: 'First Bag Unloaded Time',
  belt_name: 'Belt Name',
  belt_type: 'Belt Type',
  belt_location: 'Belt Location',
  check_in_counter: 'Check-in Counter',
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
export const MODE_OF_CALL = {
  '1': 'Query',
  '2': 'Request',
  '3': 'Feedback',
  '4': 'Emergency',
  '5': 'Business Enquiry',
};
export const CALL_TYPES = {
  '1': 'Help Phone',
  '2': 'Emergency',
  '3': 'Internal',
  '4': 'External',
};

export const CALL_STATUS = {
  terminada: 'Received',
  abandonada: 'Aborted By Caller',
  activa: 'New',
  'en-cola': 'Waiting',
};

export const DYNAMIC_COLUMNS = {
  FEEDBACK: 'feedback_emails.feedback as feedback',
  'CALL FLOW': 'call_entry.uniqueid as call_flow',
  'CALL TYPE': 'call_entry.call_type',
  'AGENT NAME': 'users.name as username',
  'CALLER NAME': 'call_tags.caller_name',
  'CALL LOG NO': 'call_entry.uniqueid',
  'RINGING TIME': 'call_entry.datetime_entry_queue',
  'PICKING TIME': 'call_entry.datetime_init',
  'FEEDBACK DOJ': 'feedback_emails.date_of_journey as feedback_doj',
  'IN QUEUE TIME': 'call_entry.duration_wait',
  'CALLER ADDRESS': 'call_tags.caller_address',
  'CALL LOG STATUS': 'call_entry.status',
  'CALLER EMAIL ID': 'call_tags.caller_email_id',
  'CALL ANSWER DESC': 'call_tags.answer',
  'CALLER CALLED NO': 'call_tags.contact_number',
  'FEEDBACK SUBJECT': 'feedback_emails.subject as feedback_subject',
  'EMERGENCY SUBJECT': 'emergency_emails.subject',
  'FEEDBACK EMAIL ID': 'feedback_emails.email_id as feedback_email_id',
  'CALLER CONTACT NO': 'call_tags.contact_number',
  'CALL SUB CATEGORY': 'sub_categories.name as sub_category_name',
  'EMERGENCY COMMENTS': 'emergency_emails.comments',
  'CALL LOG DATE TIME': 'call_entry.datetime_entry_queue',
  'CALL QUESTION DESC': 'call_tags.question',
  'CALL CATEGORY NAME': 'categories.name as category_name',
  'FEEDBACK RESPONDED': 'feedback_emails.responded as feedback_responded',
  'FEEDBACK FLIGHT INFO': 'feedback_emails.flight_info as feedback_flight_info',
  'FEEDBACK TO BE RESPOND': 'feedback_emails.caller_name as feedback_to_be_respond',
  'EMERGENCY DEPARTMENT ID': 'emergency_emails.department',
};
