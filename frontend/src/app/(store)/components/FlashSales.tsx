import { ProductCard } from "@/src/components/features/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Button } from "@/src/components/ui/button";

// Dữ liệu giả
const flashSalesProducts = [
  { id: "1", name: "HAVIT HV-G92 Gamepad", price: 120, oldPrice: 160, rating: 4.5, reviewCount: 88, imageUrl: "/placeholder.svg", discount: "-40%" },
  { id: "2", name: "AK-900 Wired Keyboard", price: 960, oldPrice: 1160, rating: 4, reviewCount: 75, imageUrl: "/placeholder.svg", discount: "-35%" },
  { id: "3", name: "IPS LCD Gaming Monitor", price: 370, oldPrice: 400, rating: 5, reviewCount: 99, imageUrl: "/placeholder.svg", discount: "-30%" },
  { id: "4", name: "S-Series Comfort Chair", price: 375, oldPrice: 400, rating: 4.5, reviewCount: 200, imageUrl: "/placeholder.svg", discount: "-25%" },
  { id: "5", name: "Another Product", price: 500, rating: 4, reviewCount: 65, imageUrl: "/placeholder.svg" },
];

export function FlashSales() {
  return (
    <section>
      {/* Tiêu đề Section */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-destructive font-semibold text-sm mb-4">Today</p>
          <h2 className="text-3xl font-semibold">Flash Sales</h2>
        </div>
        
        {/* Countdown Timer (Logic JS cần tự thêm) */}
        <div className="flex items-end gap-4">
          <div><span className="font-bold text-3xl">03</span><span className="text-sm"> Days</span></div> :
          <div><span className="font-bold text-3xl">23</span><span className="text-sm"> Hours</span></div> :
          <div><span className="font-bold text-3xl">19</span><span className="text-sm"> Minutes</span></div> :
          <div><span className="font-bold text-3xl">56</span><span className="text-sm"> Seconds</span></div>
        </div>

        <div className="hidden md:block">
           <Button variant="destructive">View All</Button>
        </div>
      </div>

      {/* Carousel Sản Phẩm */}
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {flashSalesProducts.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
      </Carousel>
    </section>
  );
}