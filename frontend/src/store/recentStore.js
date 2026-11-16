import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useRecentStore = create(
  persist(
    (set, get) => ({
      items: [],
      add: (p) => {
        const item = { _id: p._id, slug: p.slug, name: p.name, price: p.discountPrice || p.price, image: p.images?.[0] || "" };
        set({ items: [item, ...get().items.filter((i) => i._id !== p._id)].slice(0, 8) });
      },
    }),
    { name: "luxejewels-recent" }
  )
);
