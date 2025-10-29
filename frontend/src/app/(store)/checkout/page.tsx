"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";

// Dữ liệu giả
const orderItems = [
  { id: 1, name: "LCD Monitor", price: 650, quantity: 1 },
  { id: 2, name: "H1 Gamepad", price: 550, quantity: 2 },
];
const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
const shipping = 0;
const total = subtotal + shipping;


export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/cart" className="hover:underline">Cart</Link>
        <span className="mx-2">/</span>
        <span>CheckOut</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Cột 1: Billing Details */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-semibold">Billing Details</h1>
          <form className="flex flex-col gap-4">
            <Input placeholder="First Name*" />
            <Input placeholder="Company Name" />
            <Input placeholder="Street Address*" />
            <Input placeholder="Apartment, floor, etc. (optional)" />
            <Input placeholder="Town/City*" />
            <Input placeholder="Phone Number*" />
            <Input placeholder="Email Address*" />
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="save-info" />
              <label
                htmlFor="save-info"
                className="text-sm font-medium leading-none"
              >
                Save this information for faster check-out next time
              </label>
            </div>
          </form>
        </div>

        {/* Cột 2: Order Summary */}
        <div className="flex flex-col gap-6">
          {/* Items */}
          {orderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {/* <img src="/placeholder.svg" alt={item.name} className="w-10 h-10 object-cover rounded" /> */}
                <span>{item.name}</span>
              </div>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          
          <Separator />
          {/* Totals */}
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

          {/* Payment Method */}
          <RadioGroup defaultValue="bank" className="gap-4 mt-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank</Label>
               </div>
               {/* Thêm logo banks ở đây */}
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash on delivery</Label>
            </div>
          </RadioGroup>

          {/* Coupon */}
          <div className="flex gap-4 mt-4">
            <Input placeholder="Coupon Code" className="w-auto flex-grow" />
            <Button variant="destructive">Apply Coupon</Button>
          </div>

          <Button variant="destructive" size="lg" className="mt-4">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}