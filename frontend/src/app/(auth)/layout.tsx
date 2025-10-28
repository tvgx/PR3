// import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Cột 1: Ảnh */}
        <div className="w-full h-[500px] bg-secondary/30 rounded flex items-center justify-center p-8">
          {/* Thay thế bằng ảnh của bạn */}
          {/* <Image 
            src="/path/to/your/image.png" 
            alt="Auth illustration"
            width={400} 
            height={400}
            className="object-contain"
          /> */}
          <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded">
            [Ảnh minh họa]
          </div>
        </div>

        {/* Cột 2: Form (Login hoặc Signup sẽ được chèn vào đây) */}
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}