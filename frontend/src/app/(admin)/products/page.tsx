import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/src/components/ui/pagination";
import { PlusCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/utils";
import Link from "next/link";

export default function AdminProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Cột 1: Categories Sidebar */}
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              <CategoryLink name="Lorem Ipsum" count={31} isActive={true} />
              <CategoryLink name="Lorem Ipsum" count={32} />
              <CategoryLink name="Lorem Ipsum" count={14} />
              <CategoryLink name="Lorem Ipsum" count={96} />
              <CategoryLink name="Lorem Ipsum" count={11} />
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Cột 2: Product Grid */}
      <div className="col-span-3">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">All Products</h1>
          <Button variant="destructive">
            <PlusCircle className="h-5 w-5 mr-2" />
            Add New Product
          </Button>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(9).fill(0).map((_, index) => (
            <AdminProductCard key={index} />
          ))}
        </div>
        
        {/* Pagination */}
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
            {/* ... */}
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

// Component phụ
function CategoryLink({ name, count, isActive = false }: {
  name: string, count: number, isActive?: boolean
}) {
  return (
    <Link
      href="#"
      className={cn(
        "flex justify-between items-center p-3 rounded-md hover:bg-muted",
        isActive && "bg-destructive text-white hover:bg-destructive/90"
      )}
    >
      <span className="font-medium">{name}</span>
      <Badge variant={isActive ? "secondary" : "default"}>{count}</Badge>
    </Link>
  );
}

function AdminProductCard() {
  return (
    <Card>
      <CardHeader className="p-0">
        <div className="w-full h-[150px] bg-muted rounded-t-lg flex items-center justify-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-medium">Lorem Ipsum</h3>
        <p className="text-destructive font-bold text-lg">₹110.40</p>
        <CardDescription className="text-xs mt-2">
          Summary: Lorem ipsum is placeholder text commonly used in the graphic.
        </CardDescription>
        <div className="flex justify-between text-sm mt-4 pt-4 border-t">
          <span>Sales <span className="font-bold">1289</span></span>
          <ArrowRight className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}