import { Button } from "@/src/components/ui/button";
// import Image from "next/image";

export function MusicBanner() {
  return (
    <section className="bg-black text-white p-12 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        {/* Phần nội dung */}
        <div className="flex flex-col items-start gap-6">
          <p className="text-green-400 font-semibold">Categories</p>
          <h2 className="text-5xl font-semibold leading-tight">
            Enhance Your
            <br />
            Music Experience
          </h2>

          {/* Countdown (Tạm thời dùng khối vuông) */}
          <div className="flex gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center text-black">
              <span className="font-bold">23</span>
              <span className="text-xs">Hours</span>
            </div>
            <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center text-black">
              <span className="font-bold">05</span>
              <span className="text-xs">Days</span>
            </div>
            {/* Thêm các khối khác nếu cần */}
          </div>
          
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
            Buy Now!
          </Button>
        </div>
        
        {/* Phần hình ảnh */}
        <div className="relative w-full aspect-square">
          {/* Bạn có thể thay thế bằng Next/Image */}
          {/* <img
            src="/placeholder.svg"
            alt="Music Experience"
            className="w-full h-full object-contain"
          /> */}
        </div>
      </div>
    </section>
  );
}