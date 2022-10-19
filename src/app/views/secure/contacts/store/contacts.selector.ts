import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContactsState } from '../contacts.model';

export const contactsState = createFeatureSelector<ContactsState>('contactsState');

export const GetContactsGlobalSearch = createSelector(
  contactsState,
  (state: ContactsState): string => state.globalSearch
);
