"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import { toggleSidebar, setSidebarCollapsed, setTheme, openModal, closeModal } from "@/store/slices/uiSlice";
import type { UIState } from "@/types";

export function useUI() {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, theme, activeModal } = useAppSelector((state) => state.ui);

  return {
    sidebarCollapsed,
    theme,
    activeModal,
    toggleSidebar: useCallback(() => dispatch(toggleSidebar()), [dispatch]),
    setSidebarCollapsed: useCallback(
      (v: boolean) => dispatch(setSidebarCollapsed(v)),
      [dispatch]
    ),
    setTheme: useCallback(
      (t: UIState["theme"]) => dispatch(setTheme(t)),
      [dispatch]
    ),
    openModal: useCallback((id: string) => dispatch(openModal(id)), [dispatch]),
    closeModal: useCallback(() => dispatch(closeModal()), [dispatch]),
  };
}
