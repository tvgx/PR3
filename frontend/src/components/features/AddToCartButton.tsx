// src/components/features/AddToCartButton.tsx
"use client";

import { Button } from "@/src/components/ui/button";
import { useCartStore } from "@/src/store/cart.store";
import { Product } from "@/src/types";

export function AddToCartButton({ product, quantity = 1, className, children }: {
  product: Product;
  quantity?: number;
  className?: string;
  children: React.ReactNode;
}) {
  // 1. Lấy hàm async 'addItem' và 'isLoading'
  const { addItem, isLoading } = useCartStore((state) => ({
    addItem: state.addItem,
    isLoading: state.isLoading,
  }));

  const handleAddToCart = async () => {
    // 2. Gọi hàm async
    await addItem(product, quantity);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={className}
      variant="destructive"
      disabled={isLoading} // 3. Vô hiệu hóa nút khi giỏ hàng đang bận
    >
      {isLoading ? "Adding..." : children}
    </Button>
  );
}