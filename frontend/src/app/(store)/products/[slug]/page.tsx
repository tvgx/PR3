"use client";

import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Separator } from "@/src/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ProductCard } from "@/src/components/features/ProductCard";
import { Star, Heart } from "lucide-react";
import { useState } from "react";

// Dữ liệu giả
const mockProduct = {
  id: "1",
  name: "H1 Gamepad",
  price: 120,
  oldPrice: 160,
  rating: 4.5,
  reviewCount: 150,
  inStock: true,
  description: "Playstation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.",
  images: [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ],
};
const relatedProducts = [
  { id: "2", name: "RGB liquid CPU Cooler", price: 160, oldPrice: 170, rating: 4.5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "3", name: "Small BookSelf", price: 360, rating: 5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "4", name: "The north coat", price: 260, oldPrice: 360, rating: 5, reviewCount: 65, imageUrl: "/placeholder.svg" },
  { id: "5", name: "AK-900 Wired Keyboard", price: 960, oldPrice: 1160, rating: 4, reviewCount: 75, imageUrl: "/placeholder.svg" },
];

// Trang này nhận 'params' từ URL
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:underline">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:underline">Products</Link>
        <span className="mx-2">/</span>
        <span>{mockProduct.name}</span>
      </div>

      {/* Phần Thông Tin Chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Cột 1: Thư Viện Ảnh (Image Gallery) */}
        <Carousel className="w-full">
          <CarouselContent>
            {mockProduct.images.map((img, index) => (
              <CarouselItem key={index} className="bg-secondary/30 rounded-md">
                {/* <img
                  src={img}
                  alt={`${mockProduct.name} image ${index + 1}`}
                  className="w-full h-[400px] object-contain p-8"
                /> */}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-16" />
          <CarouselNext className="mr-16" />
        </Carousel>

        {/* Cột 2: Chi Tiết, Tùy Chọn */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold">{mockProduct.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array(5).fill(0).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < mockProduct.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-muted-foreground">({mockProduct.reviewCount} Reviews)</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-green-500 font-medium">
              {mockProduct.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <p className="text-3xl">${mockProduct.price}</p>
          <p className="text-sm leading-relaxed">{mockProduct.description}</p>
          
          <Separator />
          
          {/* Tùy chọn Màu Sắc */}
          <div className="flex items-center gap-4">
            <Label className="text-lg">Colours:</Label>
            <RadioGroup defaultValue="black" className="flex gap-2">
              <RadioGroupItem value="black" id="c-black" className="w-5 h-5 bg-black text-black" />
              <RadioGroupItem value="red" id="c-red" className="w-5 h-5 bg-red-500 text-red-500" />
            </RadioGroup>
          </div>

          {/* Tùy chọn Kích Cỡ */}
           <div className="flex items-center gap-4">
            <Label className="text-lg">Size:</Label>
            <RadioGroup defaultValue="m" className="flex gap-2">
              <Label htmlFor="s-xs" className="border rounded px-3 py-1.5 text-sm cursor-pointer">XS</Label>
              <RadioGroupItem value="xs" id="s-xs" className="hidden" />
              <Label htmlFor="s-s" className="border rounded px-3 py-1.5 text-sm cursor-pointer">S</Label>
              <RadioGroupItem value="s" id="s-s" className="hidden" />
              <Label htmlFor="s-m" className="border rounded px-3 py-1.5 text-sm cursor-pointer ring-2 ring-destructive">M</Label>
              <RadioGroupItem value="m" id="s-m" className="hidden" />
            </RadioGroup>
          </div>

          {/* Mua hàng (Số lượng + Nút) */}
          <div className="flex items-center gap-4 mt-4">
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center"
            />
            <Button variant="destructive" size="lg" className="flex-grow">
              Add To Cart
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Heart />
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Mô Tả / Đánh Giá */}
      <Tabs defaultValue="description" className="w-full mt-16">
        <TabsList>
          <TabsTrigger value="description">Full Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({mockProduct.reviewCount})</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6 text-muted-foreground">
          <p>{mockProduct.description}</p>
          <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <p>Reviews will be shown here.</p>
        </TabsContent>
      </Tabs>

      {/* Sản Phẩm Liên Quan */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {relatedProducts.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
}