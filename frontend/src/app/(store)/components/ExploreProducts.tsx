import { ProductCard } from "@/src/components/features/ProductCard";
import { Button } from "@/src/components/ui/button";

// Dữ liệu giả (Lấy 8 sản phẩm)
const exploreProducts = [
  { id: "1", name: "The north coat", price: 260, oldPrice: 360, rating: 5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "2", name: "Gucci duffle bag", price: 960, oldPrice: 1160, rating: 4.5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "3", name: "RGB liquid CPU Cooler", price: 160, oldPrice: 170, rating: 4.5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "4", name: "Small BookSelf", price: 360, rating: 5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "5", name: "Product 5", price: 260, rating: 5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "6", name: "Product 6", price: 960, rating: 4.5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "7", name: "Product 7", price: 160, rating: 4.5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "8", name: "Product 8", price: 360, rating: 5, reviewCount: 65, imageUrl: "/placeholder.svg" },
];

export function ExploreProducts() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-destructive font-semibold text-sm mb-4">Our Products</p>
        <h2 className="text-3xl font-semibold">Explore Our Products</h2>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {exploreProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="flex justify-center mt-12">
        <Button variant="destructive" size="lg">
          View All Products
        </Button>
      </div>
    </section>
  );
}