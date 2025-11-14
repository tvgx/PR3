/* eslint-disable react-hooks/set-state-in-effect */
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

// 1. Import useState, useEffect và Skeleton
import { useState, useEffect } from "react"; 
import { Skeleton } from "@/src/components/ui/skeleton";

export default function Header() {
  const router = useRouter();
  
  // 2. Đọc trạng thái từ store (giữ nguyên)
  const { user, token, clearAuth } = useAuthStore((state) => ({
    user: state.user,
    token: state.token,
    clearAuth: state.clearAuth,
  }));

  // 3. Tạo state "isMounted"
  const [isMounted, setIsMounted] = useState(false);

  // // 4. Set isMounted thành true CHỈ khi ở client
  useEffect(() => {
    setIsMounted(true);
  }, []); // Mảng rỗng đảm bảo nó chỉ chạy 1 lần

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
        <p>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! 
          <Link href="#" className="font-semibold underline ml-2">ShopNow</Link>
        </p>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold">
          Exclusive
        </Link>

        {/* Navigation (Desktop) - Giữ nguyên code legacyBehavior */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            {/* 5. Gói logic 'isLoggedIn' bên trong 'isMounted' */}
            {isMounted && !isLoggedIn && (
              <NavigationMenuItem>
                <Link href="/signup" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Sign Up
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search và Icons (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="What are you looking for?"
              className="pr-10 bg-secondary/50 border-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button variant="ghost" size="icon">
            <Heart size={20} />
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="/cart">
              <ShoppingCart size={20} />
            </Link>
          </Button>

           {/* 6. SỬA LỖI CHÍNH: Gating Logic */}
           {!isMounted ? (
            // Hiển thị Skeleton (khung xương) khi chưa mount (trên server)
            <Skeleton className="h-9 w-9 rounded-full" />
           ) : isLoggedIn ? (
            // Hiển thị Dropdown (khi đã mount VÀ đã đăng nhập)
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Hi, {user?.name || 'User'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    <span>Manage My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Order</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           ) : (
            // Hiển thị nút Login (khi đã mount VÀ chưa đăng nhập)
            <Button asChild variant="ghost" size="icon">
              <Link href="/login">
                <User size={20} />
              </Link>
            </Button>
           )}
           {/* --- KẾT THÚC LOGIC DROPDOWN --- */}

        </div>

        {/* Mobile Menu Trigger (Giữ nguyên) */}
        {/* ... */}
      </div>
    </header>
  );
}