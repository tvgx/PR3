/* eslint-disable react/no-unescaped-entities */
"use client";

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
import { PlusCircle, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient, { isAxiosError } from "@/src/lib/api-client";
import { Product } from "@/src/types";
import { toast } from "sonner";
import { Skeleton } from "@/src/components/ui/skeleton";

// Định nghĩa kiểu dữ liệu trả về từ API /products
type ProductsResponse = {
  products: Product[];
  totalPages: number;
  totalResults: number;
};

// Hàm fetch data
const fetchProducts = async (): Promise<ProductsResponse> => {
  const { data } = await apiClient.get("/products");
  return data;
};

export default function AdminProductsPage() {
  const queryClient = useQueryClient();

  // 1. Fetch dữ liệu sản phẩm bằng useQuery
  const { data, isLoading, isError } = useQuery<ProductsResponse>({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  // 2. Mutation để Xóa sản phẩm
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => {
      // Gọi API: DELETE /api/products/:id
      return apiClient.delete(`/products/${productId}`);
    },
    onSuccess: () => {
      toast.success("Product deleted successfully!");
      // Tải lại (refetch) danh sách sản phẩm
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete product.");
      }
    },
  });

  const handleDelete = (productId: string) => {
    deleteMutation.mutate(productId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Cột 1: Categories Sidebar (Giữ nguyên, tạm thời ẩn đi nếu muốn) */}
      <div className="col-span-1">
        {/* ... (Code Categories Sidebar) ... */}
      </div>
      
      {/* Cột 2: Product Grid */}
      <div className="col-span-3">
        {/* Header (Nút Add New) */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">All Products</h1>
          <Button asChild variant="destructive">
            {/* 3. Link đến trang tạo sản phẩm mới */}
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
            {isLoading && (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {/* 6. Trạng thái Lỗi */}
            {isError && (
              <p className="text-destructive">Failed to load products.</p>
            )}

            {/* 7. Hiển thị Bảng */}
            {!isLoading && !isError && data && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No products found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          {/* <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                          /> */}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {/* 8. Menu Hành Động (Sửa/Xóa) */}
                          <AlertDialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  {/* Link Sửa (chưa tạo) */}
                                  <Link href={`/admin/products/edit/${product.id}`}>
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                
                                {/* Nút Xóa (mở Alert) */}
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-destructive">
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                
                              </DropdownMenuContent>
                            </DropdownMenu>
                            
                            {/* 9. Hộp Thoại Xác Nhận Xóa */}
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
                                >
                                  Delete
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
      </div>
    </div>
  );
}