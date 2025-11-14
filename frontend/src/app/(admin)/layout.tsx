// src/app/(admin)/admin/layout.tsx
import React from "react";
import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminHeader } from "./_components/AdminHeader";
// XÓA DÒNG IMPORT AdminAuthGuard

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // KHÔNG CẦN BỌC <AdminAuthGuard> NỮA
    <div className="flex min-h-screen w-full bg-muted/40">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}