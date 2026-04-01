import apiClient from "@/lib/apiClient";
import type { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    );
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Still clear cookies even if server call fails
    }
  },

  async getMe(): Promise<AuthResponse["user"]> {
    const { data } = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return data;
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return data;
  },
};
