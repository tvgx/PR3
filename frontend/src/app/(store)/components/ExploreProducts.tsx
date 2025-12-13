// src/app/(store)/_components/ExploreProducts.tsx

import Link from "next/link";
import { ProductCard } from "@/src/components/features/ProductCard";
import { Button } from "@/src/components/ui/button";

// 1. Import type chung
import { Product } from "@/src/types";

// 2. Cập nhật props
export function ExploreProducts({ products }: { products: Product[] }) {
  return (
    <section>
      <div className="mb-6">
        <p className="text-destructive font-semibold text-sm mb-4">Sản phẩm của chúng tôi</p>
        <h2 className="text-3xl font-semibold">Khám phá sản phẩm</h2>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Không có sản phẩm để khám phá.</p>
      )}

      <div className="flex justify-center mt-12">
        <Link href="/products">
          <Button variant="destructive" size="lg">
            Xem tất cả sản phẩm
          </Button>
        </Link>
      </div>
    </section>
  );
}