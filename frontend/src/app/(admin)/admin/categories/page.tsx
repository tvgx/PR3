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
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api-client";
import { CategoryModal } from "@/src/components/CategoryModal";
import { Category } from "@/src/types/category";
import { Skeleton } from "@/src/components/ui/skeleton";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const { data: categories, isLoading, isError } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await apiClient.get("/categories");
            return data;
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
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

    if (isError) {
        return <div className="text-destructive">Failed to load categories.</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Categories</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                        Manage your product categories here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories?.map((category) => (
                                <TableRow
                                    key={category._id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => router.push(`/admin/categories/${category._id}`)}
                                >
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>{category.description || "-"}</TableCell>
                                    <TableCell>
                                        {format(new Date(category.createdAt), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {categories?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No categories found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
