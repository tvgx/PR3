// src/app/(store)/_components/FlashSales.tsx
// KHÔNG CẦN "use client" nữa

import { ProductCard } from "@/src/components/features/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Button } from "@/src/components/ui/button";
import { Product } from "@/src/types";

// Nhận 'products' từ props (do page.tsx truyền xuống)
export function FlashSales({ products }: { products: Product[] }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-destructive font-semibold text-sm mb-4">Today</p>
          <h2 className="text-3xl font-semibold">Flash Sales</h2>
        </div>
        {/* ... (Đồng hồ đếm ngược) ... */}
      </div>

      {/* Hiển thị dữ liệu */}
      {products && products.length > 0 ? (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      ) : (
        <p className="text-muted-foreground">No flash sale products available.</p>
      )}

      <div className="flex justify-center mt-8">
        <Button variant="destructive">View All</Button>
      </div>
    </section>
  );
}