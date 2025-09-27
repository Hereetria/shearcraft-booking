export interface RegisterSuccessResponse {
  status: 201;
  email: string;
  message: string;
}

export interface RegisterWarningResponse {
  status: 201;
  email: string;
  warning: string;
}

export interface RegisterErrorResponse {
  error: string;
}

export type RegisterResponse = RegisterSuccessResponse | RegisterWarningResponse | RegisterErrorResponse;
