export interface AdminEntity {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  last_login_at?: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface SafeAdmin {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  last_login_at?: Date | string | null;
}

export interface JwtAuthPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthSessionResponse {
  admin: SafeAdmin;
  token: string;
}
