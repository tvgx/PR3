import { Card } from "@/src/components/ui/card";
import Link from "next/link";

export function NewArrival() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-destructive font-semibold text-sm mb-4">Featured</p>
        <h2 className="text-3xl font-semibold">New Arrival</h2>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-6 h-[500px]">
        {/* 1. Ảnh lớn bên trái */}
        <Card className="col-span-1 row-span-2 relative bg-secondary/30 rounded-md overflow-hidden">
          {/* <img
            src="/placeholder.svg"
            alt="PlayStation 5"
            className="w-full h-full object-cover"
          /> */}
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-semibold">PlayStation 5</h3>
            <p className="text-sm my-2">Black and White version of the PS5 coming out soon.</p>
            <Link href="#" className="font-medium underline">Shop Now</Link>
          </div>
        </Card>

        {/* 2. Ảnh nhỏ trên cùng bên phải */}
        <Card className="col-span-1 row-span-1 relative bg-secondary/30 rounded-md overflow-hidden">
           {/* <img
            src="/placeholder.svg"
            alt="Women's Collections"
            className="w-full h-full object-cover"
          /> */}
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-2xl font-semibold">Women Collections</h3>
            <p className="text-sm my-2">Featured woman collections that give you another vibe.</p>
            <Link href="#" className="font-medium underline">Shop Now</Link>
          </div>
        </Card>

        {/* 3. Ảnh nhỏ dưới cùng bên phải (chia đôi) */}
        <div className="col-span-1 row-span-1 grid grid-cols-2 gap-6">
          <Card className="relative bg-secondary/30 rounded-md overflow-hidden">
             {/* <img
              src="/placeholder.svg"
              alt="Speakers"
              className="w-full h-full object-cover"
            /> */}
             <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">Speakers</h3>
                <Link href="#" className="text-sm underline">Shop Now</Link>
             </div>
          </Card>
          <Card className="relative bg-secondary/30 rounded-md overflow-hidden">
             {/* <img
              src="/placeholder.svg"
              alt="Perfume"
              className="w-full h-full object-cover"
            /> */}
            <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold">Perfume</h3>
                <Link href="#" className="text-sm underline">Shop Now</Link>
             </div>
          </Card>
        </div>
      </div>
    </section>
  );
}