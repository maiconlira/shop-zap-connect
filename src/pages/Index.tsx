import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PromoHighlights } from "@/components/PromoHighlights";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { ProductGallery } from "@/components/ProductGallery";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CartProvider } from "@/hooks/useCart";
import { ProductsProvider } from "@/hooks/useProducts";

const Index = () => {
  return (
    <ProductsProvider>
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <PromoHighlights />
          <FeaturedCarousel />
          <ProductGallery />
          <Features />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </CartProvider>
    </ProductsProvider>
  );
};

export default Index;
