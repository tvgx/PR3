import { ProductCard } from "@/src/components/features/ProductCard";
import { Button } from "@/src/components/ui/button";

// Dữ liệu giả
const bestSellingProducts = [
  { id: "1", name: "The north coat", price: 260, oldPrice: 360, rating: 5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "2", name: "Gucci duffle bag", price: 960, oldPrice: 1160, rating: 4.5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "3", name: "RGB liquid CPU Cooler", price: 160, oldPrice: 170, rating: 4.5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "4", name: "Small BookSelf", price: 360, rating: 5, reviewCount: 65, imageUrl: "/placeholder.svg" },
];

export function BestSelling() {
  return (
    <section>
      {/* Tiêu đề Section */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-destructive font-semibold text-sm mb-4">This Month</p>
          <h2 className="text-3xl font-semibold">Best Selling Products</h2>
        </div>
        <div>
           <Button variant="destructive">View All</Button>
        </div>
      </div>

      {/* Lưới sản phẩm */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {bestSellingProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}