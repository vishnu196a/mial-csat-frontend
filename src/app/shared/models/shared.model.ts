export interface ErrorResponse {
  errorList: string[];
  hasValidationError: boolean;
  message: string;
  status: number;
}
