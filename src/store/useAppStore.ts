import { create } from 'zustand';

interface AppState {
  copySuccess: boolean;
  setCopySuccess: (success: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  copySuccess: false,
  setCopySuccess: (success: boolean) => set({ copySuccess: success }),
}));
