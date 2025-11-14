"use client"; 

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Search, Heart, ShoppingCart, Menu, User, LogOut, Package } from "lucide-react";
import { useAuthStore } from "@/src/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useState, useEffect } from "react"; 
import { Skeleton } from "@/src/components/ui/skeleton";

export default function Header() {
  const router = useRouter();
  
  // ----- FIX LỖI GỐC (getServerSnapshot) -----
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []); // Mảng rỗng đảm bảo nó chỉ chạy 1 lần

  const { user, token, clearAuth } = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    clearAuth: state.clearAuth,
  }));
  // ----- KẾT THÚC FIX LỖI GỐC -----

  const isLoggedIn = !!token; 

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully.");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar (Giữ nguyên) */}
      <div className="bg-black text-white text-sm text-center py-2 px-4">
        {/* ... (Nội dung top bar) ... */}
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          Exclusive
        </Link>

        {/* ----- FIX LỖI MỚI (Nested <a>) ----- */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              {/* Thêm lại 'legacyBehavior' và 'passHref' */}
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {/* Thêm lại 'legacyBehavior' và 'passHref' */}
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              {/* Thêm lại 'legacyBehavior' và 'passHref' */}
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            {isMounted && !isLoggedIn && (
              <NavigationMenuItem>
                {/* Thêm lại 'legacyBehavior' và 'passHref' */}
                <Link href="/signup" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Sign Up
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        {/* ----- KẾT THÚC FIX LỖI MỚI ----- */}

        {/* Search và Icons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* ... (Thanh Search, Nút Heart, Nút Cart) ... */}
          <Button asChild variant="ghost" size="icon">
            <Link href="/cart">
              <ShoppingCart size={20} />
            </Link>
          </Button>

           {/* Logic Dropdown (Đã có 'isMounted' fix) */}
           {!isMounted ? (
            <Skeleton className="h-9 w-9 rounded-full" />
           ) : isLoggedIn ? (
            <DropdownMenu>
              {/* ... (Code Dropdown) ... */}
            </DropdownMenu>
           ) : (
            <Button asChild variant="ghost" size="icon">
              <Link href="/login">
                <User size={20} />
              </Link>
            </Button>
           )}
           {/* --- KẾT THÚC LOGIC DROPDOWN --- */}

        </div>
      </div>
    </header>
  );
}