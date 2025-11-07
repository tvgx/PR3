// src/app/(store)/_components/BestSelling.tsx

import { ProductCard } from "@/src/components/features/ProductCard";
import { Button } from "@/src/components/ui/button";

import { Product } from "@/src/types";

// 2. Cập nhật props
export function BestSelling({ products }: { products: Product[] }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-destructive font-semibold text-sm mb-4">This Month</p>
          <h2 className="text-3xl font-semibold">Best Selling Products</h2>
        </div>
        <div>
           <Button variant="destructive">View All</Button>
        </div>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
         <p className="text-muted-foreground">No best selling products available.</p>
      )}
    </section>
  );
}