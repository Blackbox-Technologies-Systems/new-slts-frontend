"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { loginUser, logoutUser, registerUser, clearError } from "@/store/slices/authSlice";
import type { LoginCredentials, RegisterCredentials } from "@/types";
import { ROUTES } from "@/constants";
import { toast } from "sonner";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(result)) {
        toast.success("Welcome back!");
        router.push(ROUTES.DASHBOARD);
        return true;
      }
      return false;
    },
    [dispatch, router]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const result = await dispatch(registerUser(credentials));
      if (registerUser.fulfilled.match(result)) {
        toast.success("Account created! Welcome aboard.");
        router.push(ROUTES.DASHBOARD);
        return true;
      }
      return false;
    },
    [dispatch, router]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
    toast.success("Logged out successfully");
    router.push(ROUTES.LOGIN);
  }, [dispatch, router]);

  const dismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    dismissError,
  };
}
