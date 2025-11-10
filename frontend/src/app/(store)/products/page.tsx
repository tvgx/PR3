import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Checkbox } from "@/src/components/ui/checkbox";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import { ProductCard } from "@/src/components/features/ProductCard";
import { Separator } from "@/src/components/ui/separator";
import { Product } from "@/src/types";


export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <span>Products</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Cột 1: Sidebar Bộ Lọc */}
        <aside className="col-span-1">
          <h2 className="text-xl font-semibold mb-6">Filters</h2>
          <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
            {/* Filter Danh mục */}
            <AccordionItem value="category">
              <AccordionTrigger className="text-lg">Category</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pt-3">
                <FilterCheckbox id="shirts" label="Shirts" />
                <FilterCheckbox id="pants" label="Pants" />
                <FilterCheckbox id="jackets" label="Jackets" />
                <FilterCheckbox id="accessories" label="Accessories" />
              </AccordionContent>
            </AccordionItem>
            
            <Separator className="my-4" />

            {/* Filter Giá (Tạm dùng Checkbox, có thể thay bằng Slider) */}
            <AccordionItem value="price">
              <AccordionTrigger className="text-lg">Price Range</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pt-3">
                <FilterCheckbox id="price-1" label="$0 - $100" />
                <FilterCheckbox id="price-2" label="$100 - $500" />
                <FilterCheckbox id="price-3" label="$500+" />
              </AccordionContent>
            </AccordionItem>
            
            <Separator className="my-4" />
            
            {/* Filter Kích cỡ */}
            <AccordionItem value="size">
              <AccordionTrigger className="text-lg">Size</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3 pt-3">
                <FilterCheckbox id="size-s" label="Small" />
                <FilterCheckbox id="size-m" label="Medium" />
                <FilterCheckbox id="size-l" label="Large" />
                <FilterCheckbox id="size-xl" label="X-Large" />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        {/* Cột 2: Lưới Sản Phẩm */}
        <main className="col-span-3">
          {/* Thanh Sắp xếp */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-muted-foreground">Showing 1-12 of 36 results</span>
            <Select defaultValue="default">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Sort by default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lưới Sản Phẩm */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {products.map((product) => (
              // Tái sử dụng ProductCard
              <ProductCard key={product.id} product={product} />
            ))}
          </div> */}

          {/* Phân trang */}
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis /></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
    </div>
  );
}

// Component phụ cho Checkbox
const FilterCheckbox = ({ id, label }: { id: string, label: string }) => (
  <div className="flex items-center space-x-2">
    <Checkbox id={id} />
    <label htmlFor={id} className="text-sm font-medium leading-none cursor-pointer">
      {label}
    </label>
  </div>
);