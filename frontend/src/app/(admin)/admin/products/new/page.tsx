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
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import apiClient, { isAxiosError } from "@/src/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { CategoryModal } from "@/src/components/CategoryModal";
import { Category } from "@/src/types/category";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">(0);
  const [stock, setStock] = useState<number | "">(0);
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Fetch Categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await apiClient.get("/categories");
      return data;
    },
  });

  // Mutations
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await apiClient.post("/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onError: (error: unknown) => {
      let message = "Image upload failed.";
      if (isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      toast.error(message);
    }
  });

  const createProductMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (newProduct: any) => {
      return apiClient.post("/products", newProduct);
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
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
    if (!imageFile) {
      toast.error("Please select an image to upload.");
      return;
    }
    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    try {
      const uploadData = await uploadMutation.mutateAsync(imageFile);
      const imageUrl = uploadData.url;

      if (!imageUrl) {
        toast.error("Failed to get image URL after upload.");
        return;
      }

      const newProduct = {
        name,
        description,
        price: price === "" ? 0 : price,
        stock: stock === "" ? 0 : stock,
        category,
        imageUrl
      };
      await createProductMutation.mutateAsync(newProduct);

    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

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

            {/* Column 1 */}
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

            {/* Column 2 */}
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
                    disabled={isCreating}
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
                    disabled={isCreating}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    if (value === "new") {
                      setIsCategoryModalOpen(true);
                    } else {
                      setCategory(value);
                    }
                  }}
                  disabled={isCreating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat._id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new" className="font-semibold text-primary">
                      + Add New Category
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="imageFile">Product Image</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  disabled={isCreating}
                />
              </div>
            </div>

            {/* Submit Button */}
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

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={(newCategory) => setCategory(newCategory.name)}
      />
    </div>
  );
}