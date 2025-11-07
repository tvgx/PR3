// src/store/cart.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { Product } from "@/src/types"; // <-- Import Product

// 1. Định nghĩa 1 item trong giỏ hàng
export type CartItem = {
  id: string; // Product ID
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

// Định nghĩa trạng thái của store
type CartState = {
  items: CartItem[];
  // 2. Cập nhật hàm addItem để nhận Product
  addItem: (product: Product, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      // 3. Cập nhật logic addItem
     addItem: (product, quantity) => {
        const existingItem = get().items.find((item) => item.id === product.id);
        const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

        // TODO: Kiểm tra tồn kho (product.stock) ở đây
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} items in stock for ${product.name}.`);
          return; // Không thêm
        }
        if (existingItem) {
          get().updateQuantity(product.id, existingItem.quantity + 1);
          toast.success(`${product.name} quantity updated.`);
        } else {
          // Thêm mới
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
          };
          set((state) => ({
            items: [...state.items, newItem],
          }));
          toast.success(`${product.name} added to cart.`);
        }
      },

      // Xóa 1 sản phẩm
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
        toast.success("Item removed from cart.");
      },

      // Cập nhật số lượng
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId); // Xóa nếu số lượng < 1
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity: quantity } : item
          ),
        }));
      },

      // Xóa sạch giỏ hàng
      clearCart: () => set({ items: [] }),

      // Lấy tổng số lượng item
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Lấy tổng tiền
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage", 
      storage: createJSONStorage(() => localStorage),
    }
  )
);