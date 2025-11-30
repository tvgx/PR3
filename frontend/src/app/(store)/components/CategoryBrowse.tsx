// src/app/(store)/_components/CategoryBrowse.tsx

import { Card, CardContent } from "@/src/components/ui/card";
import { Smartphone, Watch, Camera, Gamepad, Computer, Headset, Shirt, Home, Activity, Heart, ShoppingBasket, Trophy, Baby } from "lucide-react";
import Link from "next/link";
import { Category } from "@/src/types/category";

// 1. Tạo một đối tượng (map) để liên kết tên category với icon
// (Bạn có thể mở rộng map này)
const iconMap: { [key: string]: React.ElementType } = {
  "Woman Fashion": Shirt,
  "Men Fashion": Shirt,
  "Men's clothing": Shirt,
  "Electronics": Smartphone,
  "Home & Lifestyle": Home,
  "Medicine": Activity,
  "Sports & Outdoor": Trophy,
  "Baby's & Toys": Baby,
  "Groceries & Pets": ShoppingBasket,
  "Health & Beauty": Heart,
  "Phones": Smartphone,
  "Computers": Computer,
  "SmartWatch": Watch,
  "Camera": Camera,
  "HeadPhones": Headset,
  "Gaming": Gamepad,
};

// 2. Nhận 'categories' từ props
export function CategoryBrowse({ categories }: { categories: Category[] }) {

  // 3. Nếu không có icon, dùng icon mặc định
  const getIcon = (name: string) => {
    return iconMap[name] || Shirt; // Dùng 'Shirt' làm mặc định
  };

  return (
    <section>
      <div className="mb-6">
        <p className="text-destructive font-semibold text-sm mb-4">Categories</p>
        <h2 className="text-3xl font-semibold">Browse By Category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 4. Map qua dữ liệu thật */}
        {categories.map((cat) => {
          const Icon = getIcon(cat.name); // Lấy icon từ map
          return (
            <Link href={`/products?category=${cat.name}`} key={cat._id}>
              <Card className="flex flex-col items-center justify-center p-8 aspect-square hover:bg-destructive hover:text-white transition-colors cursor-pointer group">
                <CardContent className="p-0 flex flex-col items-center gap-4">
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.name} className="w-12 h-12 object-contain group-hover:brightness-0 group-hover:invert" />
                  ) : (
                    <Icon size={48} strokeWidth={1.5} />
                  )}
                  <span className="font-medium text-center">{cat.name}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}