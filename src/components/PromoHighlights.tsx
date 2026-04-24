import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, ShoppingCart, Tag, Timer } from "lucide-react";
import { products, type Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type PromoItem = {
  product: Product;
  discount: number; // 0-1
  tag: string;
};

// Curadoria de promoções: pega itens variados do catálogo
const buildPromos = (): PromoItem[] => {
  const pickIds = [
    "carregador-turbo",
    "fone-tws",
    "caixa-som-bluetooth",
    "powerbank-10000",
    "capinha-iphone-15-pro-max",
    "pelicula-galaxy-s24-ultra",
    "cabo-usbc",
    "capinha-galaxy-a55",
  ];
  const discounts = [0.3, 0.25, 0.2, 0.35, 0.15, 0.4, 0.5, 0.22];
  const tags = [
    "MAIS VENDIDO",
    "OFERTA RELÂMPAGO",
    "FRETE GRÁTIS",
    "QUEIMA DE ESTOQUE",
    "EXCLUSIVO",
    "SUPER OFERTA",
    "LEVE 2",
    "ÚLTIMAS UNIDADES",
  ];

  return pickIds
    .map((id, i) => {
      const product = products.find((p) => p.id === id);
      if (!product) return null;
      return { product, discount: discounts[i], tag: tags[i] };
    })
    .filter((x): x is PromoItem => x !== null);
};

export const PromoHighlights = () => {
  const { add } = useCart();
  const promos = useMemo(buildPromos, []);

  const handleAdd = (product: Product) => {
    add(product, 1);
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  if (promos.length === 0) return null;

  const [hero, ...rest] = promos;
  const heroOldPrice = hero.product.price;
  const heroNewPrice = heroOldPrice * (1 - hero.discount);

  return (
    <section
      id="promocoes"
      className="relative overflow-hidden bg-gradient-to-b from-secondary to-secondary/95 py-16 md:py-24"
    >

      <div className="container relative">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-4 py-1.5 backdrop-blur-sm">
            <Flame className="h-4 w-4 text-primary" />
            <span className="text-primary font-bold text-sm tracking-widest uppercase">
              Ofertas Imperdíveis
            </span>
          </div>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-secondary-foreground">
            Destaques em <span className="text-primary">Promoção</span>
          </h2>
          <p className="mt-3 text-secondary-foreground/70">
            Selecionamos os produtos mais procurados com descontos que não voltam.
          </p>
        </div>

        {/* Grid principal: 1 hero + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          {/* Hero promo card — clean */}
          <Card className="lg:col-span-1 lg:row-span-2 group relative overflow-hidden border-0 bg-card shadow-elegant">
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-primary text-primary-foreground hover:bg-primary px-3 py-1 text-[11px] font-bold tracking-wide">
                {hero.tag}
              </Badge>
            </div>
            <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[58%] overflow-hidden bg-muted">
              <img
                src={hero.product.image}
                alt={hero.product.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <CardContent className="p-6 flex flex-col gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {hero.product.category}
              </span>
              <h3 className="font-bold text-xl md:text-2xl leading-tight text-foreground">
                {hero.product.name}
              </h3>
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-sm line-through text-muted-foreground">
                  {formatBRL(heroOldPrice)}
                </span>
                <span className="text-3xl font-extrabold text-primary">
                  {formatBRL(heroNewPrice)}
                </span>
                <span className="ml-auto text-xs font-bold text-primary">
                  -{Math.round(hero.discount * 100)}%
                </span>
              </div>
              <Button
                onClick={() => handleAdd(hero.product)}
                size="lg"
                variant="hero"
                className="mt-2 w-full font-bold"
              >
                <ShoppingCart />
                Garantir oferta
              </Button>
            </CardContent>
          </Card>

          {/* Grid de promos secundárias */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {rest.map((promo, idx) => {
              const newPrice = promo.product.price * (1 - promo.discount);
              return (
                <Card
                  key={promo.product.id}
                  className={cn(
                    "group relative overflow-hidden border-border/40 bg-card shadow-card hover:shadow-elegant transition-smooth",
                    idx === 0 && "sm:col-span-2",
                  )}
                >
                  <div className="flex flex-row h-full">
                    <div className="relative w-2/5 shrink-0 overflow-hidden bg-muted">
                      <img
                        src={promo.product.image}
                        alt={promo.product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary text-[10px] font-extrabold px-2 py-0.5">
                          -{Math.round(promo.discount * 100)}%
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="flex-1 p-4 flex flex-col gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                        {promo.tag}
                      </span>
                      <h3 className="font-bold text-sm md:text-base leading-tight line-clamp-2">
                        {promo.product.name}
                      </h3>
                      <div className="mt-auto">
                        <div className="text-xs text-muted-foreground line-through">
                          {formatBRL(promo.product.price)}
                        </div>
                        <div className="text-lg md:text-xl font-extrabold text-primary leading-none">
                          {formatBRL(newPrice)}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAdd(promo.product)}
                        variant="hero"
                        size="sm"
                        className="mt-2 w-full"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Adicionar
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Faixa de chamada final */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-secondary-foreground/80 text-sm">
          <Flame className="h-4 w-4 text-primary animate-pulse" />
          <span>
            Promoções por tempo limitado — estoques se esgotando rapidamente.
          </span>
        </div>
      </div>
    </section>
  );
};
