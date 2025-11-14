import React from "react";
import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminHeader } from "./_components/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      
      {/* 1. Sidebar (Menu điều hướng) */}
      <AdminSidebar />

      {/* 2. Main Content (Bao gồm Header và Nội dung trang) */}
      <div className="flex-1 flex flex-col">
        
        {/* 3. Header của Admin (Search, Bell, User Dropdown) */}
        <AdminHeader />
        
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
      
    </div>
  );
}