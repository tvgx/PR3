"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

// Thêm Toaster của 'sonner' để hiển thị thông báo
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Tạo một instance client
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}