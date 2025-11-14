// src/app/(store)/products/[slug]/_components/ProductActions.tsx
"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Separator } from "@/src/components/ui/separator";
import { useCartStore } from "@/src/store/cart.store";
import { Product } from "@/src/types";
import { Heart } from "lucide-react";
import { useState } from "react";

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, isLoading } = useCartStore((state) => ({
    addItem: state.addItem,
    isLoading: state.isLoading,
  }));

  const handleAddToCart = async () => {
    await addItem(product, quantity);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ... (Tên, Giá, Mô tả, Size, Color...) */}
      <h1 className="text-4xl font-semibold">{product.name}</h1>
      <p className="text-3xl">${product.price}</p>
      <p className="text-sm leading-relaxed">{product.description}</p>
      <Separator />

      {/* Mua hàng (Số lượng + Nút) */}
      <div className="flex items-center gap-4 mt-4">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 text-center"
          disabled={isLoading} // Vô hiệu hóa input
        />
        <Button
          variant="destructive"
          size="lg"
          className="flex-grow"
          onClick={handleAddToCart}
          disabled={isLoading} // Vô hiệu hóa nút
        >
          {isLoading ? "Adding..." : "Add To Cart"}
        </Button>
        <Button variant="outline" size="icon" className="h-12 w-12">
          <Heart />
        </Button>
      </div>
    </div>
  );
}