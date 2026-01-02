import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  bookFormatId: string
  bookTitle: string
  formatType: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (bookFormatId: string) => void
  updateQuantity: (bookFormatId: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.bookFormatId === item.bookFormatId
          )
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.bookFormatId === item.bookFormatId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),
      removeItem: (bookFormatId) =>
        set((state) => ({
          items: state.items.filter((i) => i.bookFormatId !== bookFormatId),
        })),
      updateQuantity: (bookFormatId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.bookFormatId === bookFormatId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    }
  )
)
