/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react"; // <-- Import useEffect
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import { Badge } from "@/src/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient, { isAxiosError } from "@/src/lib/api-client";
import { Product } from "@/src/types";
import { toast } from "sonner";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/lib/utils";
type ProductsResponse = {
  products: Product[];
  totalPages: number;
  totalResults: number;
  currentPage: number;
};
const fetchProducts = async (page: number): Promise<ProductsResponse> => {
  const { data } = await apiClient.get(`/products?page=${page}&limit=40`);
  return data;
};
export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, error } = useQuery<ProductsResponse, Error>({
    queryKey: ["admin-products", currentPage],
    queryFn: () => fetchProducts(currentPage),
    placeholderData: (previousData) => previousData,
  });
  useEffect(() => {
    if (isError) {
      const message = isAxiosError(error) ? error.response?.data?.message : "Failed to load products.";
      toast.error(message || "Failed to load products.");
    }
  }, [isError, error]);
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => {
      return apiClient.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error: unknown) => {
      let message = "Failed to delete product.";
      if (isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    },
  });
  const handleDelete = (productId: string) => {
    deleteMutation.mutate(productId);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              <CategoryLink name="Lorem Ipsum" count={31} isActive={true} />
              <CategoryLink name="Lorem Ipsum" count={32} />
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-3">
        {/* Header (Nút Add New - giữ nguyên) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">All Products</h1>
          <Button asChild variant="destructive">
            <Link href="/admin/products/new">
              <PlusCircle className="h-5 w-5 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !data && ( // Chỉ hiển thị skeleton khi chưa có 'placeholderData'
              <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {isError && (
              <p className="text-destructive text-center">Failed to load products.</p>
            )}
            {data && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.products.map((product: Product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {/* <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          /> 
                          TODO: Thêm hình ảnh sản phẩm sau
                          */}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {/* Menu Hành Động (Sửa/Xóa) - giữ nguyên */}
                          <AlertDialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/products/edit/${product.id}`}>
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete
                                  the product "{product.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={() => handleDelete(product.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}

          </CardContent>
        </Card>

        {/* Pagination (Phân trang) */}
        {data && data.totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: data.totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={i + 1 === data.currentPage}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < data.totalPages) handlePageChange(currentPage + 1);
                  }}
                  aria-disabled={currentPage === data.totalPages}
                  className={currentPage === data.totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

// Component phụ (Giữ nguyên)
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