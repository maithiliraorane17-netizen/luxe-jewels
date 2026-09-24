import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = [...get().items];
        const idx = items.findIndex((i) => i.product === product._id);
        if (idx > -1) {
          items[idx].quantity += quantity;
        } else {
          items.push({
            product: product._id,
            name: product.name,
            image: product.images?.[0] || "",
            price: product.discountPrice || product.price,
            quantity,
            stock: product.stock,
          });
        }
        set({ items });
      },
      updateQuantity: (productId, quantity) => {
        const items = get().items.map((i) => (i.product === productId ? { ...i, quantity } : i));
        set({ items });
      },
      removeItem: (productId) => set({ items: get().items.filter((i) => i.product !== productId) }),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "luxejewels-cart" }
  )
);
