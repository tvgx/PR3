import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

import Link from "next/link";

export function HeroBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Phần Navigation bên trái */}
      <div className="col-span-1 border-r pr-4 hidden md:block">
        <ul className="flex flex-col gap-3 text-sm">
          <li><Link href="/products?category=Woman Fashion" className="hover:underline">Woman Fashion</Link></li>
          <li><Link href="/products?category=Men Fashion" className="hover:underline">Men Fashion</Link></li>
          <li><Link href="/products?category=Electronics" className="hover:underline">Electronics</Link></li>
          <li><Link href="/products?category=Home & Lifestyle" className="hover:underline">Home & Lifestyle</Link></li>
          <li><Link href="/products?category=Medicine" className="hover:underline">Medicine</Link></li>
          <li><Link href="/products?category=Sports & Outdoor" className="hover:underline">Sports & Outdoor</Link></li>
          <li><Link href="/products?category=Baby's & Toys" className="hover:underline">Baby's & Toys</Link></li>
          <li><Link href="/products?category=Groceries & Pets" className="hover:underline">Groceries & Pets</Link></li>
          <li><Link href="/products?category=Health & Beauty" className="hover:underline">Health & Beauty</Link></li>
        </ul>
      </div>

      {/* Phần Banner chính */}
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