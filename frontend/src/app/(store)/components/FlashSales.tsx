// src/app/(store)/_components/FlashSales.tsx
"use client";

import Link from "next/link";
import { ProductCard } from "@/src/components/features/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Button } from "@/src/components/ui/button";
import { Event } from "@/src/types";
import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";

// Nhận 'event' từ props
export function FlashSales({ event }: { event: Event | null }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!event) return;

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(event.endDate);

      if (now >= end) {
        clearInterval(timer);
        return;
      }

      const duration = intervalToDuration({ start: now, end });
      setTimeLeft({
        days: duration.days || 0,
        hours: duration.hours || 0,
        minutes: duration.minutes || 0,
        seconds: duration.seconds || 0,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [event]);

  if (!event) return null;

  const products = event.products || [];

  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-destructive font-semibold text-sm mb-4">Hôm nay</p>
          <h2 className="text-3xl font-semibold">{event.name}</h2>
        </div>

        {/* Countdown */}
        <div className="flex gap-4 items-end">
          <div className="text-center">
            <span className="text-xs font-medium">Ngày</span>
            <div className="text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</div>
          </div>
          <span className="text-3xl font-bold text-destructive">:</span>
          <div className="text-center">
            <span className="text-xs font-medium">Giờ</span>
            <div className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
          </div>
          <span className="text-3xl font-bold text-destructive">:</span>
          <div className="text-center">
            <span className="text-xs font-medium">Phút</span>
            <div className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
          </div>
          <span className="text-3xl font-bold text-destructive">:</span>
          <div className="text-center">
            <span className="text-xs font-medium">Giây</span>
            <div className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
          </div>
        </div>
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
        <p className="text-muted-foreground">Không có sản phẩm flash sale.</p>
      )}

      <div className="flex justify-center mt-8">
        <Link href="/products">
          <Button variant="destructive">Xem tất cả sản phẩm</Button>
        </Link>
      </div>
    </section>
  );
}