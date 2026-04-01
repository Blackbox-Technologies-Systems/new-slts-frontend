import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UIState } from "@/types";

const initialState: UIState = {
  sidebarCollapsed: false,
  theme: "system",
  activeModal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setTheme(state, action: PayloadAction<UIState["theme"]>) {
      state.theme = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, setTheme, openModal, closeModal } =
  uiSlice.actions;
export default uiSlice.reducer;
