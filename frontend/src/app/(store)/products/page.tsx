// src/app/(store)/products/page.tsx

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion"; // <-- Đã sửa đường dẫn
import { Checkbox } from "@/src/components/ui/checkbox"; // <-- Đã sửa đường dẫn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"; // <-- Đã sửa đường dẫn
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination"; // <-- Đã sửa đường dẫn
import { ProductCard } from "@/src/components/features/ProductCard"; // <-- Đã sửa đường dẫn
import { Separator } from "@/src/components/ui/separator"; // <-- Đã sửa đường dẫn
import { Product } from "@/src/types"; // <-- Đã sửa đường dẫn (giả sử file types ở src/types/index.ts)

/**
 * 1. Hàm fetch dữ liệu (chạy trên server)
 * Nó sẽ gọi API GET /api/products
 */
async function getProducts(): Promise<{ products: Product[]; totalPages: number }> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      { next: { revalidate: 60 } } // Cache 60 giây
    );
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await res.json();
    return {
      products: data.products || [], // Đảm bảo products là mảng
      totalPages: data.totalPages || 0,
    };
  } catch (error) {
    console.error(error);
    return { products: [], totalPages: 0 }; // Trả về rỗng nếu lỗi
  }
}

/**
 * 2. Biến component thành 'async' (Server Component)
 */
export default async function ProductsPage() {
  
  // 3. Gọi và 'await' dữ liệu từ backend
  const { products, totalPages } = await getProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>Products</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Cột 1: Sidebar Bộ Lọc (Giữ nguyên) */}
        <aside className="col-span-1">
          <h2 className="text-xl font-semibold mb-6">Filters</h2>
          <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
            {/* ... (Code Accordion của bạn giữ nguyên) ... */}
            <AccordionItem value="category">
              <AccordionTrigger className="text-lg">Category</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pt-3">
                <FilterCheckbox id="shirts" label="Shirts" />
                <FilterCheckbox id="pants" label="Pants" />
              </AccordionContent>
            </AccordionItem>
            <Separator className="my-4" />
            <AccordionItem value="price">
              <AccordionTrigger className="text-lg">Price Range</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pt-3">
                <FilterCheckbox id="price-1" label="$0 - $100" />
              </AccordionContent>
            </AccordionItem>
            {/* ... */}
          </Accordion>
        </aside>

        {/* Cột 2: Lưới Sản Phẩm */}
        <main className="col-span-3">
          {/* Thanh Sắp xếp (Giữ nguyên) */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-muted-foreground">Showing {products.length} results</span>
            <Select defaultValue="default">
              {/* ... (Code Select của bạn giữ nguyên) ... */}
            </Select>
          </div>

          {/* 4. Lưới Sản Phẩm (Dùng dữ liệu thật) */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p>No products found.</p>
            </div>
          )}

          {/* 5. Phân trang (Dùng dữ liệu thật) */}
          {totalPages > 0 && (
            <Pagination className="mt-12">
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink href="#" isActive={i === 0}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem><PaginationNext href="#" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </main>
      </div>
    </div>
  );
}

// Component phụ cho Checkbox (Giữ nguyên)
const FilterCheckbox = ({ id, label }: { id: string, label: string }) => (
  <div className="flex items-center space-x-2">
    <Checkbox id={id} />
    <label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
      {label}
    </label>
  </div>
);