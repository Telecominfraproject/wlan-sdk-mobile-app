import create from 'zustand';

export const useStore = create(set => ({
  // Session information
  session: null,
  setSession: state => {
    set({ session: state });
  },
  clearSession: () => set({ session: null }),

  // Brand Info
  brandInfo: null,
  setBrandInfo: state => {
    set({ brandInfo: state });
  },
  clearBrandInfo: () => set({ brandInfo: null }),

  // System Info
  systemInfo: null,
  setSystemInfo: state => {
    set({ systemInfo: state });
  },
  clearSystemInfo: () => set({ systemInfo: null }),
}));
