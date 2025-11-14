import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { toast } from "sonner";
import { Product } from "@/src/types";
import apiClient, { isAxiosError } from "@/src/lib/api-client";
type WishlistState = {
  productIds: Set<string>;
  isLoading: boolean;
  syncWishlist: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
};
type StoredWishlistState = {
  state: {
    productIds: string[];
    isLoading: boolean;
  };
  version: number;
};
type PersistState = {
  state: WishlistState;
  version: number;
};
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: new Set(),
      isLoading: false,
      syncWishlist: async () => {
        set({ isLoading: true });
        try {
          const { data } = await apiClient.get("/wishlist");
          const ids = new Set<string>(data.products.map((p: Product) => p.id));
          set({ productIds: ids });
        } catch (error) {
          if (isAxiosError(error) && error.response?.status !== 401) {
            toast.error("Failed to sync wishlist.");
          }
        } finally {
          set({ isLoading: false });
        }
      },
      toggleWishlist: async (product) => {
        set({ isLoading: true });
        const oldIds = new Set(get().productIds);
        const alreadyExists = oldIds.has(product.id);
        try {
          if (alreadyExists) {
            const newIds = new Set(oldIds);
            newIds.delete(product.id);
            set({ productIds: newIds });
            await apiClient.delete(`/wishlist/${product.id}`);
            toast.success(`${product.name} removed from wishlist.`);
          } else {
            const newIds = new Set(oldIds);
            newIds.add(product.id);
            set({ productIds: newIds });
            await apiClient.post("/wishlist", { productId: product.id });
            toast.success(`${product.name} added to wishlist.`);
          }
        } catch (error) {
          toast.error(`Failed to update wishlist.`);
          set({ productIds: oldIds }); 
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "wishlist-storage",
      serialize: (state: PersistState): string => {
        const stateToStore: StoredWishlistState = {
          ...state,
          state: {
            ...state.state,
            productIds: Array.from(state.state.productIds),
          },
        };
        return JSON.stringify(stateToStore);
      },
      deserialize: (str: string): PersistState => {
        const storedState: StoredWishlistState = JSON.parse(str);
        return {
          ...storedState,
          state: {
            ...storedState.state,
            productIds: new Set(storedState.state.productIds),
          } as WishlistState,
        };
      },
    } as PersistOptions<WishlistState>
  )
);