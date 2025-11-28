// src/app/(store)/page.tsx

import { Separator } from "@/src/components/ui/separator";
import { HeroBanner } from "./components/HeroBanner";
import { FlashSales } from "./components/FlashSales";
import { CategoryBrowse } from "./components/CategoryBrowse";
import { BestSelling } from "./components/BestSelling";
import { MusicBanner } from "./components/MusicBanner";
import { ExploreProducts } from "./components/ExploreProducts";
import { NewArrival } from "./components/NewArrival";
import { Features } from "./components/Features";

// Định nghĩa kiểu dữ liệu (bạn có thể chuyển ra file types.ts)
import { Product } from "@/src/types";


// Hàm fetch data (chạy trên server)
async function fetchProducts(query: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/products?${query}`,
      // Cache data trong 10 phút
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

import { Category } from "@/src/types/category";

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/categories`,
      { next: { revalidate: 3600 } } // Cache 1 giờ
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

// Biến trang chủ thành 'async'
export default async function HomePage() {
  // 1. Gọi tất cả API song song
  const [
    flashSalesData,
    bestSellingData,
    exploreProductsData,
    categoriesData,
  ] = await Promise.all([
    fetchProducts("tag=flash-sale&limit=4"),
    fetchProducts("tag=best-selling&limit=4"),
    fetchProducts("limit=8"),
    fetchCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-12 md:gap-16">

      {/* 2. Truyền data thật xuống component */}
      <HeroBanner />
      <FlashSales products={flashSalesData} />
      <Separator className="my-6" />
      <CategoryBrowse categories={categoriesData} />
      <Separator className="my-6" />
      <BestSelling products={bestSellingData} />
      <MusicBanner />
      <ExploreProducts products={exploreProductsData} />
      <NewArrival />
      <Features />

    </div>
  );
}