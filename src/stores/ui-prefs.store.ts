import { create } from "zustand";
import { persist } from "zustand/middleware";

type UiPrefsState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

/**
 * UI-only preferences. Server/API state stays in TanStack Query (ADR-003).
 */
export const useUiPrefsStore = create<UiPrefsState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "powermesh-ui-prefs",
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
    },
  ),
);
