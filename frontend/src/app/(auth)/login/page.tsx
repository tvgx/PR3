/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiClient from "@/src/lib/api-client";
import { useAuthStore } from "@/src/store/auth.store";
import Cookies from "js-cookie";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Link } from "lucide-react";

export default function LogInPage() {
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: (loginData: any) => {
      return apiClient.post("/auth/login", loginData);
    },
    onSuccess: (response) => {
      const { token, user } = response.data;
      setAuth(token, user); 
      Cookies.set("auth-token", token, {
        expires: 1, // Hết hạn sau 1 ngày
        secure: process.env.NODE_ENV === "production",
      });
      
      toast.success("Login successful! Redirecting...");
      if (user.role === 'admin') {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
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
            disabled={mutation.isPending}
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
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Logging in..." : "Log In"}
          </Button>
          
          <Link
            href="/forgot-password" // Trang này chưa tạo
            className="text-destructive text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup" 
          className="font-medium text-primary underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}