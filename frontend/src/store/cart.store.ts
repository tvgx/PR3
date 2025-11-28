import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { Product } from "@/src/types";
import apiClient, { isAxiosError } from "@/src/lib/api-client";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  selectedItemIds: string[]; // [NEW]
  isLoading: boolean;

  syncCart: () => Promise<void>;
  addItem: (product: Product, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;

  // [NEW] Selection actions
  toggleItemSelection: (itemId: string) => void;
  selectAll: (selected: boolean) => void;
  clearSelection: () => void;
  getSelectedItems: () => CartItem[];

  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: (onlySelected?: boolean) => number; // [MODIFIED]
};

type BackendOrderItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItemIds: [], // [NEW]
      isLoading: false,
      syncCart: async () => {
        set({ isLoading: true });
        try {
          const { data } = await apiClient.get<{ items: BackendOrderItem[] }>("/orders/cart");
          const backendItems = data.items.map((item: BackendOrderItem) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            quantity: item.quantity,
          }));

          set({ items: backendItems });
        } catch (error) {
          if (isAxiosError(error) && error.response?.status !== 401) {
            toast.error("Failed to sync cart from server.");
          } else {
            console.error("An unexpected error occurred in syncCart:", error);
          }
        } finally {
          set({ isLoading: false });
        }
      },
      addItem: async (product, quantity) => {
        set({ isLoading: true });
        const oldItems = get().items;
        const existingItem = get().items.find((item) => item.id === product.id);
        const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} items in stock for ${product.name}.`);
          set({ isLoading: false });
          return;
        }
        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === product.id ? { ...item, quantity: newQuantity } : item
            ),
          }));
        } else {
          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: quantity,
          };
          set((state) => ({ items: [...state.items, newItem] }));
        }
        try {
          await apiClient.post("/orders/cart", { productId: product.id, quantity });
          toast.success(`${product.name} added to cart.`);
        } catch (error) {
          toast.error(`Failed to add ${product.name} to cart.`);
          set({ items: oldItems });
        } finally {
          set({ isLoading: false });
        }
      },
      removeItem: async (itemId) => {
        set({ isLoading: true });
        const oldItems = get().items;
        const itemName = oldItems.find(i => i.id === itemId)?.name || 'Item';

        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
          selectedItemIds: state.selectedItemIds.filter(id => id !== itemId), // [NEW] Remove from selection too
        }));

        try {
          await apiClient.delete(`/orders/cart/${itemId}`);
          toast.success(`${itemName} removed from cart.`);
        } catch (error) {
          toast.error(`Failed to remove ${itemName}.`);
          set({ items: oldItems }); // Quay lại
        } finally {
          set({ isLoading: false });
        }
      },
      updateQuantity: async (itemId, quantity) => {
        if (quantity < 1) {
          get().removeItem(itemId);
          return;
        }

        set({ isLoading: true });
        const oldItems = get().items;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity: quantity } : item
          ),
        }));

        try {
          await apiClient.put(`/orders/cart/${itemId}`, { quantity });
        } catch (error) {
          toast.error(`Failed to update quantity.`);
          set({ items: oldItems });
        } finally {
          set({ isLoading: false });
        }
      },

      // [NEW] Selection Implementations
      toggleItemSelection: (itemId) => {
        set((state) => {
          const isSelected = state.selectedItemIds.includes(itemId);
          return {
            selectedItemIds: isSelected
              ? state.selectedItemIds.filter((id) => id !== itemId)
              : [...state.selectedItemIds, itemId],
          };
        });
      },
      selectAll: (selected) => {
        set((state) => ({
          selectedItemIds: selected ? state.items.map((item) => item.id) : [],
        }));
      },
      clearSelection: () => set({ selectedItemIds: [] }),
      getSelectedItems: () => {
        const state = get();
        return state.items.filter((item) => state.selectedItemIds.includes(item.id));
      },

      clearCart: () => set({ items: [], selectedItemIds: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: (onlySelected = false) => { // [MODIFIED]
        const state = get();
        const itemsToCalculate = onlySelected
          ? state.items.filter(item => state.selectedItemIds.includes(item.id))
          : state.items;
        return itemsToCalculate.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);