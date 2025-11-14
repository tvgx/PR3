"use client";

import { Button } from "@/src/components/ui/button";
import { useWishlistStore } from "@/src/store/wishlist.store";
import { Product } from "@/src/types";
import { Heart } from "lucide-react";

export function WishlistButton({ product }: { product: Product }) {
  const { productIds, toggleWishlist, isLoading } = useWishlistStore();
  const isWishlisted = productIds.has(product.id);

  return (
    <Button
      variant="secondary"
      size="icon"
      className="p-2 bg-white rounded-full shadow-md hover:bg-secondary"
      disabled={isLoading}
      onClick={() => toggleWishlist(product)}
    >
      <Heart
        size={16}
        // 3. Tô màu đỏ nếu đã được "thích"
        className={isWishlisted ? "text-destructive fill-destructive" : ""}
      />
    </Button>
  );
}