import { INavData } from '@coreui/angular';
import { CustomButton } from '@shared/components/ag-grid-actions/ag-grid-actions.component';
import { AgGridComponent } from '@shared/components/ag-grid/ag-grid.component';
import { ROLES } from '@shared/constants/constants';
import { ColDef } from 'ag-grid-community';
import moment from 'moment';

export enum Role {
  superAdmin = 'Admin',
  agent = 'Agent',
}

export interface ErrorResponse {
  errorList: string[];
  hasValidationError: boolean;
  message: string;
  status: number;
}

export interface AgGridContext {
  componentParent: AgGridComponent;
  stateName: string;
  hasInvite: boolean;
  hasDetails: boolean;
  hasEdit: boolean;
  hasDelete: boolean;
  hasDisable: boolean;
  hasResend: boolean;
  hasReport: boolean;
  hasUpdateCall: boolean;
  hasDownload: boolean;
  hasTag: boolean;
  canView: string;
  canEdit: string;
  canDelete: string;
  canTagCall: string;
  canDisable: string;
  canResend: string;
  customButton: CustomButton;
}

export interface Pagination {
  end_at: number | null;
  start_at: number | null;
  per_page: number;
  next_page: number | null;
  prev_page: number | null;
  total_count: number;
  total_pages: number;
  current_page: number;
  is_last_page: boolean;
  is_first_page: boolean;
}

export interface DeleteModelContent {
  title: string;
  message: string;
}

export interface DeleteResponse {
  message: string;
}

export interface ResponseMessage {
  message: string;
}

export interface NavItems extends INavData {
  roles?: ROLES[];
  iconPath?: string;
}

export interface GridColumns extends ColDef {
  roles?: ROLES[];
}

export interface ReducerState {
  pagination: Pagination;
  globalSearch: string;
  panelFromDate?: string;
  panelToDate?: string;
  panelLabel?: string;
}

export interface DropDownList {
  id: string;
  name: string;
}

export interface FloatingFilterSearchData {
  [key: string]: string | number;
}

export interface DateRangeFilter {
  start: moment.Moment | string;
  end: moment.Moment | string;
  label: string;
}

export interface DateRange {
  [key: string]: moment.Moment[];
}
export interface IdValue {
  id: string;
  value: string;
}
