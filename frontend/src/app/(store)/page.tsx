// src/app/(store)/page.tsx

import { Separator } from "@/src/components/ui/separator";
import { HeroBanner } from "./_components/HeroBanner";
import { FlashSales } from "./_components/FlashSales";
import { CategoryBrowse } from "./_components/CategoryBrowse";
import { BestSelling } from "./_components/BestSelling";
import { MusicBanner } from "./_components/MusicBanner";
import { ExploreProducts } from "./_components/ExploreProducts";
import { NewArrival } from "./_components/NewArrival";
import { Features } from "./_components/Features";

/**
 * Đây là Trang chủ (Homepage)
 * Nó chịu trách nhiệm import và sắp xếp thứ tự
 * của tất cả các section trên trang.
 */
export default function HomePage() {
  return (
    // Container chính cho toàn bộ nội dung trang chủ
    // Thêm padding (py-8) và khoảng cách giữa các section (gap-16)
    <div className="container mx-auto px-4 py-8 flex flex-col gap-12 md:gap-16">
      
      <HeroBanner />

      <FlashSales />

      <Separator className="my-6" />

      <CategoryBrowse />

      <Separator className="my-6" />

      <BestSelling />

      {/* Banner quảng cáo không cần separator */}
      <MusicBanner />

      <ExploreProducts />
      
      <NewArrival />

      <Features />

    </div>
  );
}