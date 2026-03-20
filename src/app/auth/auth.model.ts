export interface LoginResponse {
  token: string;
  email: string;
}

export interface VerifyResponse {
  valid: boolean;
  email: string;
}
