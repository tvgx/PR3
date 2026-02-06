"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import Link from "next/link";
import { Separator } from "@/src/components/ui/separator";
import { useCartStore } from "@/src/store/cart.store";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/src/components/ui/checkbox"; // [NEW]

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    getTotalPrice,
    selectedItemIds, // [NEW]
    toggleItemSelection, // [NEW]
    selectAll, // [NEW]
    clearSelection // [NEW]
  } = useCartStore();

  const subtotal = getTotalPrice(true); // [MODIFIED] Calculate only selected
  const shipping = 0; // Free (This logic will be moved to Payment page, but kept here for display consistency if needed, or we can hide it)
  const total = subtotal + shipping;

  const allSelected = items.length > 0 && selectedItemIds.length === items.length;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>Cart</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
          <Button asChild>
            <Link href="/">Return To Shop</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[auto_2fr_1fr_1fr_1fr] gap-4 p-4 font-medium shadow-sm rounded-md items-center">
              <div className="w-10 flex justify-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => selectAll(checked === true)}
                />
              </div>
              <div>Product</div>
              <div>Price</div>
              <div>Quantity</div>
              <div className="text-right">Subtotal</div>
            </div>

            {/* Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_2fr_1fr_1fr_1fr] gap-4 items-center p-4 shadow-sm rounded-md"
              >
                {/* Checkbox */}
                <div className="w-10 flex justify-center">
                  <Checkbox
                    checked={selectedItemIds.includes(item.id)}
                    onCheckedChange={() => toggleItemSelection(item.id)}
                  />
                </div>

                {/* Product */}
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl || "/placeholder.png"} alt={item.name} className="w-14 h-14 object-cover rounded" />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <Button variant="ghost" size="sm" className="w-fit h-auto p-0 text-destructive md:hidden" onClick={() => removeItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                </div>

                {/* Price */}
                <div className="hidden md:block">${item.price}</div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-20"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="hidden md:inline-flex">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
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
          </div>

          {/* Cart Total Card */}
          <div className="flex flex-col md:flex-row justify-end items-start gap-8 mt-12">
            <Card className="w-full md:w-1/3">
              <CardHeader>
                <CardTitle>Cart Total</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <span>Subtotal (Selected):</span>
                  <span>${subtotal}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
                <Button
                  asChild
                  variant="destructive"
                  className="w-full mt-4"
                  disabled={selectedItemIds.length === 0}
                >
                  {selectedItemIds.length === 0 ? (
                    <span>Select items to buy</span>
                  ) : (
                    <Link href="/payment">Buy</Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}