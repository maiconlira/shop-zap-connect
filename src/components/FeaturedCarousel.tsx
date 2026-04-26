import { useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShoppingCart } from "lucide-react";
import { products, type Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

// Categorias destacadas no carrossel
const FEATURED_CATEGORIES = ["Áudio", "Copos", "Garrafas"] as const;

const buildFeatured = (): Product[] =>
  products.filter((p) => FEATURED_CATEGORIES.includes(p.category as (typeof FEATURED_CATEGORIES)[number]));

export const FeaturedCarousel = () => {
  const { add } = useCart();
  const items = useMemo(buildFeatured, []);

  const handleAdd = (product: Product) => {
    add(product, 1);
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  if (items.length === 0) return null;

  return (
    <section
      id="destaques"
      className="bg-background py-16 md:py-24"
    >
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-bold text-sm tracking-widest uppercase">
              Coleção em Destaque
            </span>
          </div>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-foreground">
            Fones, Sons, <span className="text-primary">Copos</span> e Garrafas
          </h2>
          <p className="mt-3 text-muted-foreground">
            Selecionamos os queridinhos para o seu dia a dia: áudio premium e drinkware estiloso.
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: true })]}
          className="px-4 sm:px-12"
        >
          <CarouselContent className="-ml-4">
            {items.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <Card className="group h-full overflow-hidden border-border/60 shadow-card hover:shadow-elegant transition-smooth flex flex-col">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      width={768}
                      height={768}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground hover:bg-primary">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-5 flex flex-col gap-3 flex-1">
                    <h3 className="font-bold text-base leading-tight">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                      {product.description}
                    </p>
                    <Button
                      onClick={() => handleAdd(product)}
                      variant="hero"
                      size="default"
                      className="w-full"
                    >
                      <ShoppingCart />
                      Adicionar
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex -left-2 sm:-left-6" />
          <CarouselNext className="hidden sm:flex -right-2 sm:-right-6" />
        </Carousel>
      </div>
    </section>
  );
};
