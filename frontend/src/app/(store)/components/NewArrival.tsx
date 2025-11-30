// src/app/(store)/_components/NewArrival.tsx
import { Card } from "@/src/components/ui/card";
import Link from "next/link";
import { Product } from "@/src/types";

export function NewArrival({ products }: { products: Product[] }) {
  if (!products || products.length < 4) return null; // Cần ít nhất 4 sản phẩm để hiển thị đúng layout

  return (
    <section>
      <div className="mb-6">
        <p className="text-destructive font-semibold text-sm mb-4">Featured</p>
        <h2 className="text-3xl font-semibold">New Arrival</h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-6 h-[500px]">
        {/* 1. Ảnh lớn bên trái */}
        <Card className="col-span-1 row-span-2 relative bg-secondary/30 rounded-md overflow-hidden group">
          {products[0].imageUrl && (
            <img
              src={products[0].imageUrl}
              alt={products[0].name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-6 left-6 text-white bg-black/50 p-4 rounded-md">
            <h3 className="text-2xl font-semibold">{products[0].name}</h3>
            <p className="text-sm my-2 line-clamp-2">{products[0].description}</p>
            <Link href={`/products/${products[0].id}`} className="font-medium underline">Shop Now</Link>
          </div>
        </Card>

        {/* 2. Ảnh nhỏ trên cùng bên phải */}
        <Card className="col-span-1 row-span-1 relative bg-secondary/30 rounded-md overflow-hidden group">
          {products[1].imageUrl && (
            <img
              src={products[1].imageUrl}
              alt={products[1].name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-6 left-6 text-white bg-black/50 p-4 rounded-md">
            <h3 className="text-2xl font-semibold">{products[1].name}</h3>
            <p className="text-sm my-2 line-clamp-1">{products[1].description}</p>
            <Link href={`/products/${products[1].id}`} className="font-medium underline">Shop Now</Link>
          </div>
        </Card>

        {/* 3. Ảnh nhỏ dưới cùng bên phải (chia đôi) */}
        <div className="col-span-1 row-span-1 grid grid-cols-2 gap-6">
          <Card className="relative bg-secondary/30 rounded-md overflow-hidden group">
            {products[2].imageUrl && (
              <img
                src={products[2].imageUrl}
                alt={products[2].name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-4 left-4 text-white bg-black/50 p-2 rounded-md">
              <h3 className="text-xl font-semibold truncate">{products[2].name}</h3>
              <Link href={`/products/${products[2].id}`} className="text-sm underline">Shop Now</Link>
            </div>
          </Card>
          <Card className="relative bg-secondary/30 rounded-md overflow-hidden group">
            {products[3].imageUrl && (
              <img
                src={products[3].imageUrl}
                alt={products[3].name}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-4 left-4 text-white bg-black/50 p-2 rounded-md">
              <h3 className="text-xl font-semibold truncate">{products[3].name}</h3>
              <Link href={`/products/${products[3].id}`} className="text-sm underline">Shop Now</Link>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}