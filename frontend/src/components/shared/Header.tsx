"use client"; // Cần cho NavigationMenu và Sheet

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from '@/src/components/ui/sheet';
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Search, Heart, ShoppingCart, Menu, User } from "lucide-react";

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
          E-Commerce
        </Link>

        {/* Navigation (Desktop) */}
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
              <Link href="/sign-up" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Sign Up
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
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
          <Button variant="ghost" size="icon">
            <ShoppingCart size={20} />
          </Button>
           <Button variant="ghost" size="icon">
            <User size={20} />
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
           <Button variant="ghost" size="icon">
            <ShoppingCart size={20} />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              {/* Nội dung menu mobile */}
              <nav className="flex flex-col gap-4 mt-8 text-lg">
                <Link href="/" className="hover:underline">Home</Link>
                <Link href="/contact" className="hover:underline">Contact</Link>
                <Link href="/about" className="hover:underline">About</Link>
                <Link href="/sign-up" className="hover:underline">Sign Up</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}