"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Product } from "@/src/types";

export default function CreateEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        type: "other",
        startDate: "",
        endDate: "",
        products: [] as string[],
    });

    useEffect(() => {
        // Fetch products for selection
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/products`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };
        fetchProducts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, products: selectedOptions });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/admin/events");
            } else {
                alert("Failed to create event");
            }
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Error creating event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Event</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Event Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Event Type</Label>
                            <Select onValueChange={(value) => handleSelectChange("type", value)} defaultValue={formData.type}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="flash-sale">Flash Sale</SelectItem>
                                    <SelectItem value="music-banner">Music Banner</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input type="datetime-local" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input type="datetime-local" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="products">Select Products (Hold Ctrl to select multiple)</Label>
                            <select
                                multiple
                                className="w-full border rounded-md p-2 h-40"
                                onChange={handleProductSelect}
                            >
                                {products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Create Event"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
