import { Action } from '@ngrx/store';
import { FloatingFilterSearchData } from '@shared/models/shared.model';

export enum TagCallActionTypes {
  SET_COLUMN_SEARCH = '[TAG_CALL] set column search',
  CLEAR_DATA = '[TAG_CALL] clear data',
}

export class TagCallColumnSearch implements Action {
  readonly type = TagCallActionTypes.SET_COLUMN_SEARCH;
  constructor(public payload: FloatingFilterSearchData) {}
}
export class TagCallClearData implements Action {
  readonly type = TagCallActionTypes.CLEAR_DATA;
  constructor() {}
}

export type TagCallActions = TagCallColumnSearch | TagCallClearData;
