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
import { Sparkles, ShoppingCart, Headphones, Speaker, Coffee, Droplet } from "lucide-react";
import { products, type Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

type CarouselGroup = {
  id: string;
  title: string;
  highlight: string;
  description: string;
  icon: LucideIcon;
  filter: (p: Product) => boolean;
};

const GROUPS: CarouselGroup[] = [
  {
    id: "fones",
    title: "Fones de",
    highlight: "Ouvido",
    description: "Som imersivo, conforto e liberdade sem fio para o seu dia.",
    icon: Headphones,
    filter: (p) =>
      p.category === "Áudio" &&
      (p.name.toLowerCase().includes("fone") || p.name.toLowerCase().includes("headphone")),
  },
  {
    id: "caixas",
    title: "Caixas de",
    highlight: "Som",
    description: "Bluetooth potente, à prova d'água e com bateria de longa duração.",
    icon: Speaker,
    filter: (p) => p.category === "Áudio" && p.name.toLowerCase().includes("caixa"),
  },
  {
    id: "copos",
    title: "Copos &",
    highlight: "Tumblers",
    description: "Drinkware estiloso para água, café e bebidas geladas.",
    icon: Coffee,
    filter: (p) => p.category === "Copos",
  },
  {
    id: "garrafas",
    title: "Garrafas",
    highlight: "Térmicas",
    description: "Mantêm a temperatura por horas — perfeitas para qualquer rotina.",
    icon: Droplet,
    filter: (p) => p.category === "Garrafas",
  },
];

type RowProps = {
  group: CarouselGroup;
  items: Product[];
  onAdd: (p: Product) => void;
  delay: number;
};

const CarouselRow = ({ group, items, onAdd, delay }: RowProps) => {
  const Icon = group.icon;
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
            <Icon className="h-4 w-4 text-primary" />
            <span className="text-primary font-bold text-xs tracking-widest uppercase">
              Categoria
            </span>
          </div>
          <h3 className="mt-2 text-2xl md:text-3xl font-extrabold text-foreground">
            {group.title} <span className="text-primary">{group.highlight}</span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">{group.description}</p>
        </div>
      </div>

      <Carousel
        opts={{ align: "start", loop: items.length > 2 }}
        plugins={[Autoplay({ delay, stopOnInteraction: true })]}
        className="px-4 sm:px-12"
      >
        <CarouselContent className="-ml-4">
          {items.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
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
                  <h4 className="font-bold text-base leading-tight">{product.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  <Button
                    onClick={() => onAdd(product)}
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
  );
};

export const FeaturedCarousel = () => {
  const { add } = useCart();

  const grouped = useMemo(
    () =>
      GROUPS.map((g) => ({ group: g, items: products.filter(g.filter) })).filter(
        (g) => g.items.length > 0,
      ),
    [],
  );

  const handleAdd = (product: Product) => {
    add(product, 1);
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  if (grouped.length === 0) return null;

  return (
    <section id="destaques" className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-bold text-sm tracking-widest uppercase">
              Coleções em Destaque
            </span>
          </div>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-foreground">
            Explore por <span className="text-primary">Categoria</span>
          </h2>
          <p className="mt-3 text-muted-foreground">
            Áudio premium e drinkware estiloso, organizados para você encontrar rapidinho.
          </p>
        </div>

        <div className="space-y-16 md:space-y-20">
          {grouped.map(({ group, items }, i) => (
            <CarouselRow
              key={group.id}
              group={group}
              items={items}
              onAdd={handleAdd}
              delay={3500 + i * 700}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
