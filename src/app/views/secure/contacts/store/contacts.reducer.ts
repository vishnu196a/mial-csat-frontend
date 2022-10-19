import { ContactsState } from '../contacts.model';
import { ContactsActions, ContactsActionTypes } from './contacts.actions';

const initialState: ContactsState = {
  pagination: {
    current_page: 1,
    end_at: null,
    is_first_page: null,
    is_last_page: null,
    next_page: null,
    per_page: 10,
    prev_page: null,
    start_at: null,
    total_count: null,
    total_pages: null,
  },
  globalSearch: '',
  columns: {
    category_name: '',
    sub_category_name: '',
    name: '',
    email: '',
    phone: '',
    landline_number: '',
    terminal_name: '',
  },
};

export function contactsReducer(state = initialState, action: ContactsActions): ContactsState {
  switch (action.type) {
    case ContactsActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...action.payload },
      };
    case ContactsActionTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        pagination: { ...state.pagination, current_page: action.payload },
      };
    case ContactsActionTypes.SET_PER_PAGE:
      return { ...state, pagination: { ...state.pagination, per_page: action.payload } };
    case ContactsActionTypes.SET_GLOBAL_SEARCH:
      return { ...state, globalSearch: action.payload };
    case ContactsActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    default:
      return state;
  }
}
