export interface User {
  name: string;
  password: string;
}

export interface RegistrationRequest {
  name: string;
  password: string;
}

export interface RegistrationResponse {
  name: string;
  index: number;
  error: boolean;
  errorText?: string;
}
