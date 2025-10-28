"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Separator } from "@/src/components/ui/separator";
import Link from "next/link";
import { useState } from "react";

// Icon Google SVG đơn giản
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48" 
      width="20px" 
      height="20px" 
      {...props}
    >
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.6 5.2-6.4 9-11.3 9-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.8 3.1l6-6C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
      <path fill="#FF3D00" d="m6.3 14.8 6.5 4.9C15.8 15.1 19.7 12 24 12c3.1 0 5.8 1.2 7.8 3.1l6-6C34.1 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.8z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.7-1.7 12.9-4.5l-6.4-4.9c-1.8 1.2-4.1 1.9-6.5 1.9-4.9 0-9.2-3.2-10.7-7.5l-6.5 5.1C9.6 39.7 16.3 44 24 44z"/>
      <path fill="#1E88E5" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.9l6.4 4.9c3.8-3.5 6.4-8.7 6.4-14.8 0-1.3-.1-2.6-.4-3.9z"/>
    </svg>
  );
}

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    // TODO: Gọi API Gateway /auth/register
    console.log("Sign Up data:", { name, email, password });
  };

  const handleGoogleSignUp = () => {
    // TODO: Logic đăng ký bằng Google (thường dùng Next-Auth)
    console.log("Signing up with Google");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your details below
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }} className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-0 border-b rounded-none px-0 shadow-none focus-visible:ring-0"
          />
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

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            variant="destructive"
            className="w-full py-6 text-md"
          >
            Create Account
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full py-6 text-md"
            onClick={handleGoogleSignUp}
          >
            <GoogleIcon className="mr-2" />
            Sign up with Google
          </Button>
        </div>
      </form>

      <Separator />

      {/* Code để navigate (chuyển trang) */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login" // <-- Điều hướng về trang Log In
          className="font-medium text-primary underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}