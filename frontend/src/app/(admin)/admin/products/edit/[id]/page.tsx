/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation } from "@tanstack/react-query";
import apiClient, { isAxiosError } from "@/src/lib/api-client";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Product } from "@/src/types";
import { Skeleton } from "@/src/components/ui/skeleton";

const fetchProductById = async (id: string): Promise<Product> => {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">(0);
  const [stock, setStock] = useState<number | "">(0);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { data: product, isLoading: isLoadingProduct, isError } = useQuery<Product, Error>({
    queryKey: ["admin-product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !!productId,
  });

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setStock(product.stock);
      setCategory(product.category);
      setImageUrl(product.imageUrl);
    }
  }, [product]);

  const mutation = useMutation({
    mutationFn: (updatedProduct: Partial<Product>) => {
      return apiClient.put(`/products/${productId}`, updatedProduct);
    },
    onSuccess: () => {
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update product.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProduct = {
      name,
      description,
      price: price === "" ? 0 : price,
      stock: stock === "" ? 0 : stock,
      category,
      imageUrl
    };
    mutation.mutate(updatedProduct);
  };

  if (isLoadingProduct) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-1/3" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive">
        <h1 className="text-2xl">Product not found or failed to load.</h1>
        <Button asChild variant="link" className="mt-4">
          <Link href="/admin/products">Go Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold">Edit Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Update the product information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                  rows={5}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={price}
                    onFocus={() => price === 0 && setPrice("")}
                    onBlur={() => price === "" && setPrice(0)}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") setPrice("");
                      else setPrice(parseFloat(val));
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onFocus={() => stock === 0 && setStock("")}
                    onBlur={() => stock === "" && setStock(0)}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") setStock("");
                      else setStock(parseInt(val));
                    }}
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
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}