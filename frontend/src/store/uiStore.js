import { create } from "zustand";

export const useUI = create((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),
  cartOpen: false,
  openCart: () => set({ cartOpen: true, searchOpen: false }),
  closeCart: () => set({ cartOpen: false }),
  searchOpen: false,
  openSearch: () => set({ searchOpen: true, cartOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
  quickView: null,
  openQuickView: (product) => set({ quickView: product }),
  closeQuickView: () => set({ quickView: null }),
}));
