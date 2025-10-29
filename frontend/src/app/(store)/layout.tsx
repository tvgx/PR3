import Footer from "@/src/components/shared/Footer";
import Header from "@/src/components/shared/Header";

// Layout này sẽ bọc tất cả các trang con trong (store)
// như trang chủ, trang sản phẩm, giỏ hàng, v.v.
export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Header sẽ xuất hiện ở đây */}
      <Header />
      
      {/* 'children' chính là file 'page.tsx' (trang chủ) 
        hoặc các trang con khác trong (store)
      */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer sẽ xuất hiện ở đây */}
      <Footer />
    </>
  );
}