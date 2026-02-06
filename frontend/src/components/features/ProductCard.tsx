import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Star, Heart, Eye } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho sản phẩm
import { Product } from "@/src/types";
import { AddToCartButton } from "@/src/app/(store)/components/AddToCartButton";
import { WishlistButton } from "./WishlistButton";
import { Button } from "@/src/components/ui/button"

// Props của component
interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="w-full max-w-sm border-0 shadow-none overflow-hidden group">
            {/* Phần hình ảnh và icon */}
            <div className="relative bg-secondary/30 rounded-md overflow-hidden p-4">
                <img
                    src={product.imageUrl || "/placeholder.png"} // Dùng ảnh placeholder nếu không có
                    alt={product.name}
                    className="aspect-square w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                {product.discount && (
                    <Badge
                        variant="destructive"
                        className="absolute top-3 left-3"
                    >
                        {product.discount}
                    </Badge>
                )}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <WishlistButton product={product} />

                    <Button variant="secondary" size="icon" className="p-2 bg-white rounded-full shadow-md hover:bg-secondary">
                        <Eye size={16} />
                    </Button>
                </div>

                <AddToCartButton
                    product={product}
                    quantity={1}
                    className="absolute bottom-0 left-0 w-full rounded-none text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                >
                    Add To Cart
                </AddToCartButton>

            </div>

            {/* Phần nội dung */}
            <CardContent className="pt-4 px-1">
                <h3 className="text-md font-medium truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-destructive font-medium">${product.price}</span>
                    {product.oldPrice && (
                        <span className="text-muted-foreground line-through text-sm">
                            ${product.oldPrice}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                className={
                                    i < product.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                }
                            />
                        ))}
                    <span className="text-muted-foreground text-sm ml-1">
                        ({product.reviewCount})
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
