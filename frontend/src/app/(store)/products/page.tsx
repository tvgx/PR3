import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import { ProductCard } from "@/src/components/features/ProductCard";
import { Product } from "@/src/types";
import { Category } from "@/src/types/category";
import { ProductFilters } from "./ProductFilters";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

async function getProducts(
  page: number = 1,
  limit: number = 30,
  category?: string,
  minPrice?: string,
  maxPrice?: string
): Promise<{ products: Product[]; totalPages: number }> {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000/api'}/products?page=${page}&limit=${limit}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (minPrice) {
      url += `&minPrice=${minPrice}`;
    }
    if (maxPrice) {
      url += `&maxPrice=${maxPrice}`;
    }

    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    return {
      products: data.products || [],
      totalPages: data.totalPages || 0,
    };
  } catch (error) {
    console.error(error);
    return { products: [], totalPages: 0 };
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000/api'}/categories`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

function SelectAllButton() {
  // Client component wrapper can be used, but since this is a server component file, 
  // we might need to make a small client component or just inline it if we convert this page to use client logic for buttons,
  // but this page is async server component. 
  // Actually, we can just use a <Link> or a Client Component for the button.
  // Let's create a Client Component for the button to access router.
  return (
    <div className="mb-6">
      <Link href="/products">
        <Button variant="outline">Chọn toàn bộ</Button>
      </Link>
    </div>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams?.page) || 1;
  const categoryParam = resolvedSearchParams?.category as string | undefined;
  const minPriceParam = resolvedSearchParams?.minPrice as string | undefined;
  const maxPriceParam = resolvedSearchParams?.maxPrice as string | undefined;
  const limit = 30;

  const [productData, categories] = await Promise.all([
    getProducts(page, limit, categoryParam, minPriceParam, maxPriceParam),
    getCategories(),
  ]);

  const { products, totalPages } = productData;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span>Sản phẩm</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Cột 1: Sidebar Bộ Lọc */}
        <ProductFilters categories={categories} />

        {/* Cột 2: Lưới Sản Phẩm */}
        <main className="col-span-3">
          {/* Nút Chọn toàn bộ */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <Link href="/products">
                <Button variant="secondary">Chọn toàn bộ</Button>
              </Link>
              <span className="text-muted-foreground self-center">Hiển thị {products.length} kết quả</span>
            </div>

            <Select defaultValue="default">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Mặc định</SelectItem>
                <SelectItem value="price-asc">Giá: Thấp đến Cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao đến Thấp</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lưới Sản Phẩm */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => (
                // Fix key error: ensure id exists, fallback to _id if available in runtime data
                <ProductCard key={product.id || (product as any)._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p>Không tìm thấy sản phẩm.</p>
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 0 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem><PaginationPrevious href={`/products?page=${Math.max(1, page - 1)}`} /></PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink href={`/products?page=${i + 1}`} isActive={i + 1 === page}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem><PaginationNext href={`/products?page=${Math.min(totalPages, page + 1)}`} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>
    </div>
  );
}
