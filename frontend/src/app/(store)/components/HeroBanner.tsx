import { Card } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export function HeroBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Phần Navigation bên trái - Tạm thời để trống */}
      <div className="col-span-1 border-r pr-4 hidden md:block">
        <ul className="flex flex-col gap-3 text-sm">
          <li>Woman Fashion</li>
          <li>Men Fashion</li>
          <li>Electronics</li>
          <li>Home & Lifestyle</li>
          {/* ... Thêm các danh mục khác */}
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
          <Button variant="link" className="text-white p-0">
            Shop Now &rarr;
          </Button>
        </Card>
      </div>
    </div>
  );
}