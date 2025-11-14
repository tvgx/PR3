"use client";

import { ProductCard } from "@/src/components/features/ProductCard";
import { Button } from "@/src/components/ui/button";
import { useWishlistStore } from "@/src/store/wishlist.store";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { Product } from "@/src/types";
import { Skeleton } from "@/src/components/ui/skeleton";
import Link from "next/link";
import { useEffect } from "react";

// Component Skeleton
const ProductSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-[250px] w-full rounded-md" />
    <Skeleton className="h-4 w-[150px]" />
    <Skeleton className="h-4 w-[100px]" />
  </div>
);

export default function WishlistPage() {
  // 1. Đồng bộ store với backend khi trang tải
  const syncWishlist = useWishlistStore((state) => state.syncWishlist);
  
  useEffect(() => {
    syncWishlist();
  }, [syncWishlist]);

  // 2. Fetch dữ liệu từ API (GET /api/wishlist)
  const { data: wishlist, isLoading, isError } = useQuery({
    queryKey: ["wishlist"], // Cache
    queryFn: async () => {
      const { data } = await apiClient.get("/wishlist");
      return data.products as Product[]; // Trả về mảng sản phẩm
    },
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>Wishlist</span>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">My Wishlist</h1>
        <Button variant="outline">Move All To Bag</Button>
      </div>

      {/* 3. Hiển thị Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      )}

      {/* 4. Hiển thị Lỗi */}
      {isError && (
        <p className="text-destructive">Failed to load wishlist.</p>
      )}

      {/* 5. Hiển thị Wishlist */}
      {!isLoading && !isError && wishlist && (
        <>
          {wishlist.length === 0 ? (
            <p className="text-muted-foreground">Your wishlist is empty.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}