import { HeroBanner } from "./_components/HeroBanner";
import { FlashSales } from "./_components/FlashSales";
import { CategoryBrowse } from "./_components/CategoryBrowse";
import { BestSelling } from "./_components/BestSelling";
import { MusicBanner } from "./_components/MusicBanner";
import { ExploreProducts } from "./_components/ExploreProducts";
import { NewArrival } from "./_components/NewArrival";
import { Features } from "./_components/Features";
import { Separator } from "@/src/components/ui/separator";
import Header from "@/src/components/shared/Header";
import Footer from "@/src/components/shared/Footer";


export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col gap-16">
      <Header />
      {/* 1. Hero Banner */}
      <HeroBanner />
      
      {/* 2. Flash Sales */}
      <FlashSales />
      
      <Separator />

      {/* 3. Browse By Category */}
      <CategoryBrowse />
      
      <Separator />

      {/* 4. Best Selling Products */}
      <BestSelling />

      {/* 5. Music Banner */}
      <MusicBanner />

      {/* 6. Explore Our Products */}
      <ExploreProducts />

      {/* 7. New Arrival */}
      <NewArrival />

      {/* 8. Features (Delivery, Support) */}
      <Features />
      <Footer />
    </div>
  );
}