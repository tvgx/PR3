"use client";

import { Button } from "@/src/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { useParams, useRouter } from "next/navigation";
import { Category } from "@/src/types/category";
import { Product } from "@/src/types";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function CategoryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const categoryId = params.id as string;

    const { data: category, isLoading: isLoadingCategory } = useQuery<Category>({
        queryKey: ["category", categoryId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/categories/${categoryId}`);
            return data;
        },
        enabled: !!categoryId,
    });

    const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
        queryKey: ["category-products", categoryId],
        queryFn: async () => {
            const { data } = await apiClient.get(`/categories/${categoryId}/products`);
            return data;
        },
        enabled: !!categoryId,
    });

    const isLoading = isLoadingCategory || isLoadingProducts;

    if (isLoading) {
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
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!category) {
        return <div className="text-destructive">Category not found.</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="icon">
                    <Link href="/admin/categories">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-semibold">{category.name}</h1>
                    <p className="text-muted-foreground">{category.description}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Products in this Category</CardTitle>
                    <CardDescription>
                        List of all products belonging to {category.name}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        {product.imageUrl && (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="h-10 w-10 object-cover rounded-md"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>${product.price}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                                        >
                                            Edit
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No products found in this category.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
