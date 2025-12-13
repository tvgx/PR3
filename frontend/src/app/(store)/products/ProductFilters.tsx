"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Separator } from "@/src/components/ui/separator";
import { Category } from "@/src/types/category";

interface ProductFiltersProps {
    categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get("category") || "";
    const currentMinPrice = searchParams.get("minPrice") || "";
    const currentMaxPrice = searchParams.get("maxPrice") || "";

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset to page 1 when filter changes
        params.set("page", "1");

        router.push(`/products?${params.toString()}`);
    };

    const updatePriceRange = (minPrice: string, maxPrice: string) => {
        const params = new URLSearchParams(searchParams.toString());

        // Remove existing price params
        params.delete("minPrice");
        params.delete("maxPrice");

        // Add new ones if provided
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        // Reset to page 1
        params.set("page", "1");

        router.push(`/products?${params.toString()}`);
    };

    const isPriceRangeActive = (min: string, max: string) => {
        return currentMinPrice === min && currentMaxPrice === max;
    };

    return (
        <aside className="col-span-1">
            <h2 className="text-xl font-semibold mb-6">Bộ lọc</h2>
            <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
                <AccordionItem value="category">
                    <AccordionTrigger className="text-lg">Danh mục</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3 pt-3">
                        {categories.map((cat) => (
                            <div key={cat._id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={cat._id}
                                    checked={currentCategory === cat.name}
                                    onCheckedChange={(checked) => {
                                        updateFilter("category", checked ? cat.name : "");
                                    }}
                                />
                                <label
                                    htmlFor={cat._id}
                                    className="text-sm font-medium leading-none cursor-pointer"
                                >
                                    {cat.name}
                                </label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
                <Separator className="my-4" />
                <AccordionItem value="price">
                    <AccordionTrigger className="text-lg">Khoảng giá</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-3 pt-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="price-1"
                                checked={isPriceRangeActive("0", "500000")}
                                onCheckedChange={(checked) => {
                                    updatePriceRange(checked ? "0" : "", checked ? "500000" : "");
                                }}
                            />
                            <label
                                htmlFor="price-1"
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                Dưới 500.000đ
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="price-2"
                                checked={isPriceRangeActive("500000", "1000000")}
                                onCheckedChange={(checked) => {
                                    updatePriceRange(checked ? "500000" : "", checked ? "1000000" : "");
                                }}
                            />
                            <label
                                htmlFor="price-2"
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                500.000đ - 1.000.000đ
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="price-3"
                                checked={isPriceRangeActive("1000000", "")}
                                onCheckedChange={(checked) => {
                                    updatePriceRange(checked ? "1000000" : "", "");
                                }}
                            />
                            <label
                                htmlFor="price-3"
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                Trên 1.000.000đ
                            </label>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
}
