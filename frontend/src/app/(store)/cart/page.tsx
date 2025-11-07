"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import Link from "next/link";
import { Separator } from "@/src/components/ui/separator";
import { useCartStore } from "@/src/store/cart.store"; // <-- Import Cart Store
import { Trash2 } from "lucide-react";

export default function CartPage() {
  // 1. Lấy dữ liệu và hàm từ Zustand store
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  const subtotal = getTotalPrice();
  const shipping = 0; // Free
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>Cart</span>
      </div>

      {/* 2. Kiểm tra nếu giỏ hàng trống */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
          <Button asChild>
            <Link href="/">Return To Shop</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* 3. Hiển thị Cart Items Table */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="hidden md:grid grid-cols-5 gap-4 p-4 font-medium shadow-sm rounded-md">
              <div className="col-span-2">Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div className="text-right">Subtotal</div>
            </div>

            {/* Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-3 md:grid-cols-5 gap-4 items-center p-4 shadow-sm rounded-md"
              >
                {/* Product */}
                <div className="flex items-center gap-4 col-span-3 md:col-span-2">
                  <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-14 h-14 object-cover rounded" />
                  <span>{item.name}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
                {/* Price */}
                <div className="hidden md:block">${item.price}</div>
                {/* Quantity */}
                <div>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
                {/* Subtotal */}
                <div className="text-right font-medium">
                  ${item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-8">
            <Button asChild variant="outline">
              <Link href="/">Return To Shop</Link>
            </Button>
            {/* <Button variant="outline">Update Cart</Button> (Đã tự động) */}
          </div>

          {/* 4. Coupon and Cart Total */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mt-12">
            {/* Coupon */}
            <div className="flex gap-4">
              <Input placeholder="Coupon Code" className="w-auto" />
              <Button variant="destructive">Apply Coupon</Button>
            </div>

            {/* Cart Total Card */}
            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Cart Total</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
                <Button asChild variant="destructive" className="w-full mt-4">
                  <Link href="/checkout">Proceed to checkout</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}