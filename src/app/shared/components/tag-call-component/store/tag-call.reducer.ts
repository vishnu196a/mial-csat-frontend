import { TagCallState } from '@secure/live-call/live-call.model';
import { TagCallActions, TagCallActionTypes } from './tag-call.actions';

const initialState: TagCallState = {
  columns: {
    name: '',
    email: '',
    terminal: '',
    category: '',
    subCategory: '',
    question: '',
    answer: '',
    contactNo: '',
  },
};

export function tagCallReducer(state = initialState, action: TagCallActions): TagCallState {
  switch (action.type) {
    case TagCallActionTypes.SET_COLUMN_SEARCH:
      return {
        ...state,
        columns: { ...state.columns, ...action.payload },
      };
    case TagCallActionTypes.CLEAR_DATA:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
