"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient, { isAxiosError } from "@/src/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient(); // Dùng để làm mới (invalidate)
  
  // State cho các trường
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  
  // State cho file ảnh
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Mutation để Upload file (API: POST /api/upload)
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file); // Tên 'file' phải khớp với backend 'upload.single('file')'
      
      const { data } = await apiClient.post("/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data; // Trả về { url: '...' }
    },
    onError: (error: unknown) => {
      let message = "Image upload failed.";
      if (isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    }
  });
  
  // Mutation để Tạo sản phẩm (API: POST /api/products)
  const createProductMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (newProduct: any) => {
      return apiClient.post("/products", newProduct);
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] }); // Làm mới danh sách
      router.push("/admin/products");
    },
    onError: (error: unknown) => {
      let message = "Failed to create product.";
      if (isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Kiểm tra xem đã chọn file chưa
    if (!imageFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    try {
      // 2. Bước A: Upload ảnh trước
      // Dùng mutateAsync để đợi kết quả upload
      const uploadData = await uploadMutation.mutateAsync(imageFile);
      const imageUrl = uploadData.url; // Lấy URL từ API upload

      if (!imageUrl) {
        toast.error("Failed to get image URL after upload.");
        return;
      }

      // 3. Bước B: Tạo sản phẩm với URL vừa nhận được
      const newProduct = { 
        name, 
        description, 
        price, 
        stock, 
        category, 
        imageUrl // Dùng URL thật
      };
      await createProductMutation.mutateAsync(newProduct);
      
    } catch (error) {
      // Lỗi đã được xử lý trong 'onError' của từng mutation
      console.error("Failed to create product:", error);
    }
  };

  // Trạng thái loading (khi 1 trong 2 mutation đang chạy)
  const isCreating = uploadMutation.isPending || createProductMutation.isPending;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold">Add New Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Cột 1 */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  disabled={isCreating}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  disabled={isCreating}
                  rows={5}
                />
              </div>
            </div>

            {/* Cột 2 */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={price} 
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} 
                    disabled={isCreating}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input 
                    id="stock" 
                    type="number"
                    value={stock} 
                    onChange={(e) => setStock(parseInt(e.target.value) || 0)} 
                    disabled={isCreating}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  disabled={isCreating}
                />
              </div>
              
              {/* THAY THẾ IMAGE URL BẰNG FILE UPLOAD */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="imageFile">Product Image</Label>
                <Input 
                  id="imageFile" 
                  type="file"
                  accept="image/*" // Chỉ chấp nhận ảnh
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  disabled={isCreating}
                />
              </div>
            </div>

            {/* Nút Submit */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="destructive"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}