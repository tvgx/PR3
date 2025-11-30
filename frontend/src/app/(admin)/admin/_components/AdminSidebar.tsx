"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { LayoutDashboard, ShoppingBag, Package, ListTree, Calendar } from "lucide-react";

// Định nghĩa các link (theo ảnh)
const navLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "All Products", icon: ShoppingBag },
  { href: "/admin/orders", label: "Order List", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: ListTree },
  { href: "/admin/events", label: "Events", icon: Calendar },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
      {/* Logo đồng bộ với E-commerce */}
      <div className="border-b p-6">
        <Link href="/admin/dashboard">
          <h2 className="text-2xl font-bold text-center">
            Exclusive
            <span className="block text-sm font-normal text-destructive">Admin Panel</span>
          </h2>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Button
                  asChild
                  // Dùng màu 'destructive' (đỏ) làm màu active
                  variant={isActive ? "destructive" : "ghost"}
                  className="w-full justify-start gap-3"
                >
                  <Link href={link.href}>
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}