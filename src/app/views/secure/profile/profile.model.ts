import { Role } from '@shared/models/shared.model';

export interface ChangePwdRequestParams {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePwdResponse {
  id: number;
  name: string;
  email: string;
  sign_in_count: number;
  last_sign_in_at: string;
  current_sign_in_at: string;
  role: Role;
}
