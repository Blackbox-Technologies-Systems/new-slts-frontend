import apiClient from "@/lib/apiClient";
import type { User } from "@/types";
import { API_ENDPOINTS } from "@/constants";

export const userService = {
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>(API_ENDPOINTS.USER.PROFILE);
    return data;
  },

  async updateProfile(updates: Partial<Pick<User, "name" | "avatar">>): Promise<User> {
    const { data } = await apiClient.patch<User>(API_ENDPOINTS.USER.UPDATE, updates);
    return data;
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USER.DELETE);
  },

  // Admin only
  async getAllUsers(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>("/user/all");
    return data;
  },
};
