"use client"; // Cần cho các hook (useState, v.v.) sau này

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export default function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: Gọi API Gateway /auth/login
    console.log("Login data:", { email, password });
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
            className="border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            type="submit"
            variant="destructive"
            className="flex-grow py-6 text-md"
          >
            Log In
          </Button>
          
          {/* Code để navigate (chuyển trang) */}
          <Link
            href="/forgot-password" // <-- Tạo trang này nếu cần
            className="text-destructive text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}