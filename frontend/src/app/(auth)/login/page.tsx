/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiClient from "@/src/lib/api-client";
import { useAuthStore } from "@/src/store/auth.store";
import Cookies from "js-cookie"; // <-- Import js-cookie

export default function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: (loginData: any) => {
      return apiClient.post("/auth/login", loginData);
    },
    onSuccess: (response) => {
      const { token, user } = response.data;
      
      // 1. Lưu vào Zustand (cho client UI)
      setAuth(token, user); 
      
      // 2. LƯU TOKEN VÀO COOKIE (CHO SERVER MIDDLEWARE)
      // Tên cookie này phải được nhớ
      Cookies.set("auth-token", token, {
        expires: 1, // Hết hạn sau 1 ngày
        secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS ở production
      });
      
      toast.success("Login successful! Redirecting...");
      
      // 3. LOGIC REDIRECT MỚI (THEO YÊU CẦU CỦA BẠN)
      if (user.role === 'admin') {
        router.push("/admin/dashboard"); // Chuyển đến trang Admin
      } else {
        router.push("/"); // Chuyển về trang chủ
      }
      
      // Tải lại toàn bộ ứng dụng để đồng bộ
      router.refresh();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    mutation.mutate({ email, password });
  };

  // ... (JSX của form giữ nguyên) ...
  return (
    <div className="flex flex-col gap-6">
      {/* ... (Form JSX) ... */}
    </div>
  );
}