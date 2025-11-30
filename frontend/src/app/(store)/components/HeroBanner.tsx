// src/app/(store)/_components/HeroBanner.tsx
import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { Category } from "@/src/types/category";

export function HeroBanner({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Phần Navigation bên trái */}
      <div className="col-span-1 border-r pr-4 hidden md:block">
        <ul className="flex flex-col gap-3 text-sm">
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link href={`/products?category=${cat.name}`} className="hover:underline">
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Phần Banner chính - Có thể làm dynamic sau nếu cần, hiện tại giữ nguyên layout nhưng link dynamic */}
      <div className="col-span-1 md:col-span-2">
        <Card className="w-full h-[340px] bg-black text-white p-10 flex flex-col justify-between items-start">
          <div>
            <p className="text-sm text-gray-300">iPhone 14 Series</p>
            <h1 className="text-4xl font-semibold leading-tight mt-4">
              Up to 10% <br />
              off Voucher
            </h1>
          </div>
          <Button asChild variant="link" className="text-white p-0">
            <Link href="/products?tag=flash-sale">Shop Now &rarr;</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}