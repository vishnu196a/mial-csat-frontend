import { Role } from '@shared/models/shared.model';

export interface AuthenticationState {
  name: string;
  email: string;
  role: Role;
  token: string;
  id: number;
  agent_code: string;
  employee_number: string;
  confirmed_at: string;
  sign_in_count: number;
  last_sign_in_at: string;
  current_sign_in_at: string;
}

export type UserDetail = Omit<AuthenticationState, 'token'>;

export type UpdatedUserDetail = Omit<AuthenticationState, 'token' | 'parent_name'>;

export type UserNameAndRole = Pick<AuthenticationState, 'name' | 'role'>;

export type UserRoleAndToken = Pick<AuthenticationState, 'role' | 'token'>;