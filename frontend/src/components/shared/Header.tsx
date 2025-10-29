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

// GIẢ ĐỊNH: Bạn có một hook hoặc context để biết user đã đăng nhập hay chưa
// const { isLoggedIn, user } = useAuth(); 
// Tạm thời, chúng ta sẽ giả định isLoggedIn = true
const isLoggedIn = true; 

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar (Thông báo) */}
      <div className="bg-black text-white text-sm text-center py-2 px-4">
        <p>
          Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! 
          <Link href="#" className="font-semibold underline ml-2">ShopNow</Link>
        </p>
      </div>
      
      {/* Main Header */}
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Exclusive
        </Link>

        {/* Navigation (Desktop) - ĐÃ CẬP NHẬT */}
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
            <NavigationMenuItem>
              <Link href="/signup" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Sign Up
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search và Icons (Desktop) - ĐÃ CẬP NHẬT */}
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

           {/* --- LOGIC DROPDOWN TÀI KHOẢN --- */}
           {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Hi, Md Rimel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    <span>Manage My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders"> {/* Cần tạo trang này */}
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Order</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
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

        {/* Mobile Menu Trigger (Giữ nguyên) */}
        {/* ... */}
      </div>
    </header>
  );
}