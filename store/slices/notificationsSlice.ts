import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NotificationState, Notification } from "@/types";

const initialState: NotificationState = {
  notifications: [
    {
      id: "1",
      title: "Welcome!",
      message: "Your account has been set up successfully.",
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "New feature",
      message: "Analytics dashboard is now available.",
      type: "info",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  unreadCount: 2,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<Notification, "id" | "read" | "createdAt">>) {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
    removeNotification(state, action: PayloadAction<string>) {
      const index = state.notifications.findIndex((n) => n.id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    clearAll(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, removeNotification, clearAll } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
