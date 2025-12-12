// src/app/(store)/_components/NewArrival.tsx
import { Card } from "@/src/components/ui/card";
import Link from "next/link";
import { Product } from "@/src/types";

// Helper function to filter duplicate vercel.svg images
function getUniqueImages(product: Product | undefined): string[] {
  // Safety check for undefined product
  if (!product) {
    return ['/vercel.svg'];
  }

  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.imageUrl];

  // Filter out vercel.svg, but keep one if all images are vercel.svg
  const nonPlaceholder = allImages.filter(img => img !== '/vercel.svg');

  if (nonPlaceholder.length === 0) {
    // All images are placeholders, return just one
    return ['/vercel.svg'];
  }

  return nonPlaceholder;
}

export function NewArrival({ products }: { products: Product[] }) {
  // Enhanced safety check - ensure we have exactly 4 valid products
  if (!products || products.length < 4) return null;

  // Additional check to ensure all 4 products are defined
  if (!products[0] || !products[1] || !products[2] || !products[3]) return null;

  // Get unique images for each product
  const product0Images = getUniqueImages(products[0]);
  const product1Images = getUniqueImages(products[1]);
  const product2Images = getUniqueImages(products[2]);
  const product3Images = getUniqueImages(products[3]);

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
          {product0Images[0] && (
            <img
              src={product0Images[0]}
              alt={products[0]?.name || 'Product'}
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
          {product1Images[0] && (
            <img
              src={product1Images[0]}
              alt={products[1]?.name || 'Product'}
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
            {product2Images[0] && (
              <img
                src={product2Images[0]}
                alt={products[2]?.name || 'Product'}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-4 left-4 text-white bg-black/50 p-2 rounded-md">
              <h3 className="text-xl font-semibold truncate">{products[2].name}</h3>
              <Link href={`/products/${products[2].id}`} className="text-sm underline">Shop Now</Link>
            </div>
          </Card>

          <Card className="relative bg-secondary/30 rounded-md overflow-hidden group">
            {product3Images[0] && (
              <img
                src={product3Images[0]}
                alt={products[3]?.name || 'Product'}
                className="w-full h-full object-cover"
              />
            )}

            {/* Show "+" overlay if product has more than 4 images */}
            {product3Images.length > 4 && (
              <Link
                href={`/products/${products[3].id}`}
                className="absolute inset-0 bg-black/70 flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <span className="text-white text-5xl font-bold">
                  +{product3Images.length - 4}
                </span>
              </Link>
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
