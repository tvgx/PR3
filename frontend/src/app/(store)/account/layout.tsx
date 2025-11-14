"use client"; // Cần thiết để đọc 'useAuthStore' (cho tên user) và 'usePathname'

import { useAuthStore } from "@/src/store/auth.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

// Component Sidebar (có thể tách file riêng nếu muốn)
function AccountSidebar() {
  const pathname = usePathname();
  
  // Định nghĩa các link
  const navLinks = [
    { href: "/account", label: "My Profile" },
    { href: "/account/address", label: "Address Book" },
    { href: "/account/payment", label: "My Payment Options" },
  ];
  const orderLinks = [
    { href: "/account/orders", label: "My Orders" },
    { href: "/account/returns", label: "My Returns" },
    { href: "/account/cancellations", label: "My Cancellations" },
  ];
  
  return (
    <div className="col-span-1 flex flex-col gap-4">
      <div>
        <h3 className="font-medium mb-2">Manage My Account</h3>
        <ul className="pl-4 text-muted-foreground flex flex-col gap-2">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "hover:underline",
                  pathname === link.href ? "text-destructive" : ""
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium mb-2">My Orders</h3>
        <ul className="pl-4 text-muted-foreground flex flex-col gap-2">
          {orderLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "hover:underline",
                  pathname === link.href ? "text-destructive" : ""
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-medium mb-2"><Link href="/wishlist" className="hover:underline">My Wishlist</Link></h3>
      </div>
    </div>
  );
}


// Layout chính cho /account/*
export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authUser = useAuthStore((state) => state.user);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb và Welcome (dùng chung) */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span>My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-destructive">{authUser?.name || 'User'}</span>
        </div>
      </div>

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Cột 1: Sidebar */}
        <AccountSidebar />

        {/* Cột 2: Nội dung trang (là page.tsx hoặc orders/page.tsx) */}
        <div className="col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}