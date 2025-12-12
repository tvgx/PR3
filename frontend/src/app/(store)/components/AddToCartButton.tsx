// src/components/features/AddToCartButton.tsx
"use client";

import { Button } from "@/src/components/ui/button";
import { useCartStore } from "@/src/store/cart.store";
import { Product } from "@/src/types";
import { toast } from "sonner";

// Nút này nhận 'product' và 'quantity'
export function AddToCartButton({ product, quantity = 1, className, children }: {
  product: Product;
  quantity?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);

    // Show toast notification with product name
    toast.success(`Bạn đã thêm sản phẩm ${product.name} vào giỏ hàng`, {
      position: "top-right",
      duration: 3000,
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={className}
      variant="destructive" // (Bạn có thể thay đổi)
    >
      {children}
    </Button>
  );
}