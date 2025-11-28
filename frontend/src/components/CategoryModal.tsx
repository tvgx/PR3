"use client";

import { Button } from "@/src/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient, { isAxiosError } from "@/src/lib/api-client";
import { toast } from "sonner";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (newCategory: any) => void;
}

export function CategoryModal({ isOpen, onClose, onSuccess }: CategoryModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newCategory: { name: string; description: string }) => {
            const { data } = await apiClient.post("/categories", newCategory);
            return data;
        },
        onSuccess: (data) => {
            toast.success("Category created successfully!");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setName("");
            setDescription("");
            if (onSuccess) onSuccess(data);
            onClose();
        },
        onError: (error: unknown) => {
            let message = "Failed to create category.";
            if (isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            toast.error(message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ name, description });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Create a new category for your products.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={mutation.isPending}>
                            {mutation.isPending ? "Creating..." : "Create Category"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
