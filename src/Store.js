import create from 'zustand';

export const useStore = create(set => ({
  session: null,
  setSession: state => {
    set({session: state});
  },
  clearSession: () => set({session: null}),
}));
