import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  cartId: string;
  title: string;
  price: number;
  qty: number;
  modifiers: string[];
  notes: string;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: any, customData: any) => void;
  removeFromCart: (cartId: string) => void;
  updateQty: (cartId: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product, customData) =>
        set((state) => {
          const cartId = `${product.id}-${customData.modifiers.sort().join('-')}`;
          const exists = state.cart.find((i) => i.cartId === cartId);

          if (exists) {
            return {
              cart: state.cart.map((i) => (i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i)),
            };
          }
          return {
            cart: [...state.cart, { ...product, ...customData, cartId, qty: 1 }],
          };
        }),
      removeFromCart: (cartId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.cartId !== cartId),
        })),
      updateQty: (cartId, delta) =>
        set((state) => ({
          cart: state.cart.map((i) => {
            if (i.cartId === cartId) {
              const newQty = i.qty + delta;
              return newQty > 0 ? { ...i, qty: newQty } : i;
            }
            return i;
          }),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'boba-cart-storage' } // Simpan otomatis di LocalStorage
  )
);
