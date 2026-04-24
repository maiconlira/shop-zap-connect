import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductGallery } from "@/components/ProductGallery";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { CartProvider } from "@/hooks/useCart";

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <ProductGallery />
          <Features />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </CartProvider>
  );
};

export default Index;
