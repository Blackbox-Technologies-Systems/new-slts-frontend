"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./useRedux";
import {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
} from "@/store/slices/notificationsSlice";
import type { Notification } from "@/types";

export function useNotifications() {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notifications
  );

  return {
    notifications,
    unreadCount,
    add: useCallback(
      (n: Omit<Notification, "id" | "read" | "createdAt">) =>
        dispatch(addNotification(n)),
      [dispatch]
    ),
    markRead: useCallback((id: string) => dispatch(markAsRead(id)), [dispatch]),
    markAllRead: useCallback(() => dispatch(markAllAsRead()), [dispatch]),
    remove: useCallback((id: string) => dispatch(removeNotification(id)), [dispatch]),
    clearAll: useCallback(() => dispatch(clearAll()), [dispatch]),
  };
}
