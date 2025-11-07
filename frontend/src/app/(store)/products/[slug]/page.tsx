// src/app/(store)/products/[slug]/page.tsx

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ProductCard } from "@/src/components/features/ProductCard";
import { Product } from "@/src/types"; // Import type
import { ProductActions } from "./_components/ProductActions"; // <-- Import component mới

// Hàm fetch data (giữ nguyên)
async function getProductData(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/products/${slug}`,
      { next: { revalidate: 3600 } } 
    );
    if (!res.ok) throw new Error("Product not found");
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Hàm fetch sản phẩm liên quan (MỚI)
async function getRelatedProducts(category: string): Promise<Product[]> {
   try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/products?category=${category}&limit=4`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  
  const product = await getProductData(params.slug);
  
  // Tải sản phẩm liên quan dựa trên danh mục của sản phẩm chính
  const relatedProducts = product ? await getRelatedProducts(product.category) : [];

  if (!product) {
    // (Xử lý Not Found giữ nguyên)
    return (
       <div className="container mx-auto py-16 text-center">...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb (giữ nguyên) */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </div>

      {/* Phần Thông Tin Chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Cột 1: Thư Viện Ảnh (Image Gallery) */}
        <Carousel className="w-full">
          <CarouselContent>
            {/* {(product.images && product.images.length > 0 ? product.images : [product.imageUrl]).map((img, index) => (
              <CarouselItem key={index} className="bg-secondary/30 rounded-md">
                <img
                  src={img || "/placeholder.svg"}
                  alt={`${product.name} image ${index + 1}`}
                  className="w-full h-[400px] object-contain p-8"
                />
              </CarouselItem>
            ))} */}
          </CarouselContent>
          <CarouselPrevious className="ml-16" />
          <CarouselNext className="mr-16" />
        </Carousel>

        {/* Cột 2: Dùng Client Component để xử lý tương tác */}
        <ProductActions product={product} />

      </div>

      {/* Tab Mô Tả / Đánh Giá */}
      <Tabs defaultValue="description" className="w-full mt-16">
        <TabsList>
          <TabsTrigger value="description">Full Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6 text-muted-foreground">
          <p>{product.description}</p>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <p>Reviews will be shown here.</p>
        </TabsContent>
      </Tabs>

      {/* Sản Phẩm Liên Quan (Dùng dữ liệu thật) */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
        {relatedProducts.length > 0 ? (
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {relatedProducts
                .filter(p => p.id !== product.id) // Loại sản phẩm hiện tại
                .map((related) => (
                  <CarouselItem key={related.id} className="md:basis-1/3 lg:basis-1/4">
                    <ProductCard product={related} />
                  </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        ) : (
          <p className="text-muted-foreground">No related products found.</p>
        )}
      </div>
    </div>
  );
}