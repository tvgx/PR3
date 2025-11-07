"use client";

import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Import toast
import apiClient from "@/src/lib/api-client"; // Import axios
import { useAuthStore } from "@/src/store/auth.store"; // Import auth store
import { Input } from "@/src/components/ui/input";

export default function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth); // Lấy hàm setAuth

  // 1. Sử dụng useMutation để gọi API
  const mutation = useMutation({
    mutationFn: (loginData: unknown) => {
      // Gọi đến API Gateway: POST /auth/login
      return apiClient.post("/auth/login", loginData);
    },
    onSuccess: (response) => {
      // 2. Khi thành công
      const { token, user } = response.data;
      
      // 3. Lưu token và user vào store (localStorage)
      setAuth(token, user); 
      
      toast.success("Login successful! Redirecting...");
      
      // 4. Chuyển hướng về trang chủ
      router.push("/"); 
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      // 5. Khi thất bại
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    // Chạy mutation
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Log in to Exclusive</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your details below
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <Input
            type="text"
            placeholder="Email or Phone Number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mutation.isPending} // Vô hiệu hóa khi đang gọi API
            className="border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={mutation.isPending}
            className="border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            type="submit"
            variant="destructive"
            className="flex-grow py-6 text-md"
            disabled={mutation.isPending} // Hiển thị trạng thái loading
          >
            {mutation.isPending ? "Logging in..." : "Log In"}
          </Button>
          
          <Link
            href="/forgot-password"
            className="text-destructive text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-primary underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}