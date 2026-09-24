import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const ids = get().ids.includes(productId)
          ? get().ids.filter((id) => id !== productId)
          : [...get().ids, productId];
        set({ ids });
      },
      isWishlisted: (productId) => get().ids.includes(productId),
    }),
    { name: "luxejewels-wishlist" }
  )
);
