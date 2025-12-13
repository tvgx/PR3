// src/components/features/AddToCartButton.tsx
"use client";

import { Button } from "@/src/components/ui/button";
import { useCartStore } from "@/src/store/cart.store";
import { useAuthStore } from "@/src/store/auth.store";
import { Product } from "@/src/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Nút này nhận 'product' và 'quantity'
export function AddToCartButton({ product, quantity = 1, className, children }: {
  product: Product;
  quantity?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      router.push("/login");
      return;
    }

    // Toast logic is handled in the store to avoid duplicates/false positives
    addItem(product, quantity);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={className}
      variant="destructive"
    >
      {children}
    </Button>
  );
}