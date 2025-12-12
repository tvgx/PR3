"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";
import { useCartStore } from "@/src/store/cart.store"; // Import Cart store
import { useAuthStore } from "@/src/store/auth.store"; // Import Auth store
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const token = useAuthStore((state) => state.token);
  const subtotal = getTotalPrice();
  const shipping = 0;
  const total = subtotal + shipping;

  // 3. State cho form thanh toán
  const [firstName, setFirstName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Vietnam");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to proceed to checkout.");
      router.push("/login");
    }
    // Nếu giỏ hàng trống, đá về trang chủ
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      router.push("/");
    }
  }, [token, items, router]);

  // 5. Mutation để gọi API đặt hàng
  const mutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (shippingAddress: any) => {
      // Gọi API: POST /api/orders (đã bao gồm checkout)
      return apiClient.post("/orders", { shippingAddress });
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
      clearCart(); // Xóa giỏ hàng ở client
      router.push("/account/orders"); // Chuyển đến trang lịch sử đơn hàng
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to place order.");
    }
  });

  // PayOS Payment Mutation
  const payOSMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (orderData: any) => {
      // First create the order
      const orderResponse = await apiClient.post("/orders", { shippingAddress: orderData.shippingAddress });
      const orderId = orderResponse.data._id;

      // Then create payment link
      const paymentResponse = await apiClient.post("/payment/create-payment-link", {
        orderId: orderId,
        amount: total,
        description: `Payment for order ${orderId}`,
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/failed`,
      });

      return paymentResponse.data;
    },
    onSuccess: (data) => {
      // Redirect to PayOS checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create payment link.");
    }
  });

  // 6. Hàm xử lý khi nhấn nút "Place Order"
  const handlePlaceOrder = () => {
    // Kiểm tra form
    if (!firstName || !streetAddress || !city || !postalCode || !country) {
      toast.error("Please fill in all required shipping details.");
      return;
    }

    const shippingAddress = {
      street: streetAddress,
      city: city,
      postalCode: postalCode,
      country: country,
    };

    // Check payment method
    if (paymentMethod === "payos") {
      // Use PayOS
      payOSMutation.mutate({ shippingAddress });
    } else {
      // Use COD
      mutation.mutate(shippingAddress);
    }
  };


  // Nếu giỏ hàng trống hoặc đang tải, không hiển thị gì
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb (Giữ nguyên) */}
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
            <Input
              placeholder="First Name*"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input placeholder="Company Name" />
            <Input
              placeholder="Street Address*"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
            />
            <Input placeholder="Apartment, floor, etc. (optional)" />
            <Input
              placeholder="Town/City*"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <Input
              placeholder="Postal Code*"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <Input placeholder="Phone Number*" />
            <Input placeholder="Email Address*" />
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox id="save-info" />
              <label htmlFor="save-info" className="text-sm font-medium">
                Save this information for faster check-out next time
              </label>
            </div>
          </form>
        </div>

        {/* Cột 2: Order Summary (Dùng dữ liệu thật) */}
        <div className="flex flex-col gap-6">
          {/* Items */}
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl || "/placeholder.svg"} alt={item.name} className="w-10 h-10 object-cover rounded" />
                <span>{item.name}</span>
                <span>x{item.quantity}</span>
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
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="payos" id="payos" />
              <Label htmlFor="payos">Bank Transfer (PayOS)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod">Cash on delivery</Label>
            </div>
          </RadioGroup>

          {/* Coupon (Giữ nguyên) */}
          <div className="flex gap-4 mt-4">
            <Input placeholder="Coupon Code" className="w-auto flex-grow" />
            <Button variant="destructive">Apply Coupon</Button>
          </div>

          <Button
            variant="destructive"
            size="lg"
            className="mt-4"
            onClick={handlePlaceOrder}
            disabled={mutation.isPending || payOSMutation.isPending}
          >
            {mutation.isPending || payOSMutation.isPending ? "Processing..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}