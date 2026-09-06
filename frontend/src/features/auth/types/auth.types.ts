export interface AdminUser {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  last_login_at?: string | null;
}

export interface AuthSession {
  admin: AdminUser;
  token: string;
}

export interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
