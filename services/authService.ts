import apiClient from "@/lib/apiClient";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const authService = {
  async loginWithCredentials(
    credentials: LoginCredentials
  ): Promise<{ message: string }> {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return data;
  },

  async verifyLoginOtp(payload: {
    email: string
    otp: string
  }): Promise<{
    token: string;
    user: User
  }> {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.VERIFYOTP, payload)
    return data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.FORGOTPASSSWORD, { email })
    return data;
  },

  async verifyForgotPasswordOtp(payload: {
    email: string;
    otp: string;
  }): Promise<{
    message: string;
    reset_token: string
  }> {
    const { data } = await apiClient.post(API_ENDPOINTS.AUTH.VERIFYFORGOTPASSWORD, payload)
    return data;
  },

  async setForgotPassword(payload: {
    reset_token: string
    password: string
    password_confirmation: string
  }): Promise<{ message: string }> {
    const { data } = await apiClient.post("/auth/set-forgot-password", payload)
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Still clear cookies even if server call fails
    }
  },

};
