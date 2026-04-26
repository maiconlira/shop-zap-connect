import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, ShoppingCart } from "lucide-react";
import { useProducts, type ManagedProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const DEFAULT_TAGS = [
  "MAIS VENDIDO",
  "OFERTA RELÂMPAGO",
  "FRETE GRÁTIS",
  "QUEIMA DE ESTOQUE",
  "EXCLUSIVO",
  "SUPER OFERTA",
  "LEVE 2",
  "ÚLTIMAS UNIDADES",
];

const FALLBACK_PROMOS = [
  { category: "Capinhas", discount: 25, tag: "MAIS VENDIDO" },
  { category: "Películas", discount: 30, tag: "OFERTA RELÂMPAGO" },
  { category: "Áudio", discount: 20, tag: "SUPER OFERTA" },
  { category: "Carregadores", discount: 15, tag: "FRETE GRÁTIS" },
  { category: "Copos", discount: 18, tag: "QUEIMA DE ESTOQUE" },
  { category: "Garrafas", discount: 22, tag: "EXCLUSIVO" },
];

const buildFallbackPromos = (products: ManagedProduct[]) => {
  const used = new Set<string>();

  return FALLBACK_PROMOS.map(({ category, discount, tag }) => {
    const product = products.find(
      (p) => p.category.toLowerCase() === category.toLowerCase() && !used.has(p.id),
    );

    if (!product) return null;
    used.add(product.id);

    return {
      ...product,
      promo: true,
      discount: product.discount && product.discount > 0 ? product.discount : discount,
      promoTag: product.promoTag?.trim() || tag,
    };
  }).filter((product): product is ManagedProduct => Boolean(product));
};

export const PromoHighlights = () => {
  const { add } = useCart();
  const { promos, effectivePrice } = useProducts();

  const items = useMemo(
    () =>
      promos.map((product, i) => ({
        product,
        tag: product.promoTag?.trim() || DEFAULT_TAGS[i % DEFAULT_TAGS.length],
      })),
    [promos],
  );

  const handleAdd = (product: ManagedProduct) => {
    const finalPrice = effectivePrice(product);
    add({ ...product, price: finalPrice }, 1);
    toast.success("Adicionado ao carrinho", { description: product.name });
  };

  if (items.length === 0) return null;

  const [hero, ...rest] = items;
  const heroFinal = effectivePrice(hero.product);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
          {/* Hero promo card */}
          <Card className="lg:col-span-1 lg:row-span-2 group relative overflow-hidden border-0 bg-card shadow-elegant">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
              <Badge className="bg-primary text-primary-foreground hover:bg-primary px-3 py-1 text-[11px] font-bold tracking-wide">
                {hero.tag}
              </Badge>
              {hero.product.discount && hero.product.discount > 0 && (
                <Badge className="bg-foreground text-background hover:bg-foreground px-3 py-1 text-[11px] font-extrabold">
                  -{hero.product.discount}%
                </Badge>
              )}
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
              <p className="text-sm text-muted-foreground line-clamp-2">
                {hero.product.description}
              </p>
              <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                {heroFinal < hero.product.price && (
                  <span className="text-base line-through text-muted-foreground">
                    {formatPrice(hero.product.price)}
                  </span>
                )}
                <span className="text-3xl font-extrabold text-primary">
                  {formatPrice(heroFinal)}
                </span>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  à vista
                </span>
              </div>
              <Button
                onClick={() => handleAdd(hero.product)}
                size="lg"
                variant="hero"
                className="mt-2 w-full font-bold"
              >
                <ShoppingCart />
                Quero esse
              </Button>
            </CardContent>
          </Card>

          {/* Grid de promos secundárias */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {rest.map((promo, idx) => {
              const final = effectivePrice(promo.product);
              return (
                <Card
                  key={promo.product.id}
                  className={cn(
                    "group relative overflow-hidden border-border/40 bg-card shadow-card hover:shadow-elegant transition-smooth",
                    idx === 0 && rest.length > 1 && "sm:col-span-2",
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
                      <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                        <Badge className="bg-primary text-primary-foreground hover:bg-primary text-[10px] font-extrabold px-2 py-0.5">
                          {promo.tag}
                        </Badge>
                        {promo.product.discount && promo.product.discount > 0 && (
                          <Badge className="bg-foreground text-background hover:bg-foreground text-[10px] font-extrabold px-2 py-0.5">
                            -{promo.product.discount}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="flex-1 p-4 flex flex-col gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                        {promo.product.category}
                      </span>
                      <h3 className="font-bold text-sm md:text-base leading-tight line-clamp-2">
                        {promo.product.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {promo.product.description}
                      </p>
                      <div className="flex items-baseline gap-2 flex-wrap">
                        {final < promo.product.price && (
                          <span className="text-xs line-through text-muted-foreground">
                            {formatPrice(promo.product.price)}
                          </span>
                        )}
                        <span className="text-lg font-extrabold text-primary">
                          {formatPrice(final)}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleAdd(promo.product)}
                        variant="hero"
                        size="sm"
                        className="mt-auto w-full"
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
