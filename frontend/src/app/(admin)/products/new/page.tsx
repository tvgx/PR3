/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea"; // Cần cài: npx shadcn-ui@latest add textarea
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Tạm thời dùng URL, chưa dùng Upload

  // Mutation để gọi API: POST /api/products
  const mutation = useMutation({
    mutationFn: (newProduct: any) => {
      return apiClient.post("/products", newProduct);
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      router.push("/admin/products"); // Quay về trang danh sách
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create product.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = { name, description, price, stock, category, imageUrl };
    mutation.mutate(newProduct);
  };

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
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
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
                    onChange={(e) => setPrice(parseFloat(e.target.value))} 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input 
                    id="stock" 
                    type="number"
                    value={stock} 
                    onChange={(e) => setStock(parseInt(e.target.value))} 
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>
              {/* (Sau này sẽ thay bằng File Upload) */}
            </div>

            {/* Nút Submit */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="destructive"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}