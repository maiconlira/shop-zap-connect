import { useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import { cn } from "@/lib/utils";

export const ProductGallery = () => {
  const [active, setActive] = useState("Todos");
  const filtered =
    active === "Todos" ? products : products.filter((p) => p.category === active);

  return (
    <section id="produtos" className="container py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-primary font-bold text-sm tracking-widest uppercase">
          Catálogo
        </span>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold">
          Produtos disponíveis
        </h2>
        <p className="mt-3 text-muted-foreground">
          Escolha os produtos, ajuste a quantidade e clique em reservar para
          finalizar pelo WhatsApp.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={active === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActive(cat)}
            className={cn(
              "rounded-full",
              active === cat && "shadow-soft"
            )}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
