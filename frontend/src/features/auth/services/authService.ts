import { apiClient } from "../../../services/apiClient";
import { ApiResponse } from "../../../types";
import { AdminUser, AuthSession } from "../types/auth.types";

const TOKEN_KEY = "photography_platform_auth_token";

export const authService = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    delete apiClient.defaults.headers.common["Authorization"];
  },

  login: async (email: string, password: string): Promise<AuthSession> => {
    const response = await apiClient.post<ApiResponse<AuthSession>>("/auth/login", {
      email,
      password,
    });
    const session = response.data.data!;
    authService.setToken(session.token);
    return session;
  },

  getMe: async (): Promise<AdminUser> => {
    const token = authService.getToken();
    if (token) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    const response = await apiClient.get<ApiResponse<{ admin: AdminUser }>>("/auth/me");
    return response.data.data!.admin;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      authService.removeToken();
    }
  },
};
