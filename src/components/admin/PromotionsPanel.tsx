import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Flame, Percent, Search, Tag, TrendingDown, Sparkles } from "lucide-react";
import { useProducts, type ManagedProduct } from "@/hooks/useProducts";
import { toast } from "sonner";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PROMO_TAG_SUGGESTIONS = [
  "OFERTA RELÂMPAGO",
  "MAIS VENDIDO",
  "FRETE GRÁTIS",
  "QUEIMA DE ESTOQUE",
  "SUPER OFERTA",
  "ÚLTIMAS UNIDADES",
];

const PromoCard = ({ product }: { product: ManagedProduct }) => {
  const { updateProduct, effectivePrice } = useProducts();
  const [discount, setDiscount] = useState<number>(product.discount ?? 0);
  const [tag, setTag] = useState<string>(product.promoTag ?? "");

  const finalPrice = effectivePrice({ ...product, discount, promo: true });
  const dirty = discount !== (product.discount ?? 0) || tag !== (product.promoTag ?? "");

  return (
    <Card className="border-primary/20 bg-card shadow-card hover:shadow-elegant transition-smooth">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                  {product.category}
                </p>
                <h4 className="font-bold text-sm leading-tight truncate">
                  {product.name}
                </h4>
              </div>
              <Badge className="bg-primary text-primary-foreground hover:bg-primary shrink-0">
                <Flame className="h-3 w-3 mr-1" />
                {discount}%
              </Badge>
            </div>
            <div className="mt-1 flex items-baseline gap-2 flex-wrap">
              <span className="text-xs line-through text-muted-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="font-extrabold text-primary">
                {formatPrice(finalPrice)}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider inline-flex items-center gap-0.5">
                <TrendingDown className="h-3 w-3" />
                Economia {formatPrice(product.price - finalPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1">
              <Percent className="h-3 w-3" />
              Desconto
            </Label>
            <Input
              type="number"
              min={0}
              max={99}
              value={discount || ""}
              onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1">
              <Tag className="h-3 w-3" />
              Etiqueta
            </Label>
            <Input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Auto"
              list={`tags-${product.id}`}
              className="h-9"
            />
            <datalist id={`tags-${product.id}`}>
              {PROMO_TAG_SUGGESTIONS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              updateProduct(product.id, { promo: false, discount: 0, promoTag: "" });
              toast.success("Promoção removida", { description: product.name });
            }}
          >
            Remover promoção
          </Button>
          <Button
            size="sm"
            variant="hero"
            disabled={!dirty || discount <= 0}
            onClick={() => {
              updateProduct(product.id, { discount, promoTag: tag.trim() });
              toast.success("Promoção atualizada", { description: product.name });
            }}
          >
            Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AddPromoCard = ({ product }: { product: ManagedProduct }) => {
  const { updateProduct } = useProducts();
  const [discount, setDiscount] = useState(10);

  return (
    <Card className="border-dashed border-border/60 bg-muted/20">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 rounded-md overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{product.category}</p>
          <p className="text-sm font-semibold truncate">{product.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Input
            type="number"
            min={1}
            max={99}
            value={discount || ""}
            onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
            className="h-9 w-20"
            placeholder="%"
          />
          <Button
            size="sm"
            variant="hero"
            disabled={discount <= 0}
            onClick={() => {
              updateProduct(product.id, { promo: true, discount });
              toast.success("Promoção criada", { description: product.name });
            }}
          >
            <Sparkles className="h-4 w-4" />
            Promover
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const PromotionsPanel = () => {
  const { products, effectivePrice } = useProducts();
  const [search, setSearch] = useState("");
  const [showOnlyEligible, setShowOnlyEligible] = useState(true);

  const promos = useMemo(() => products.filter((p) => p.promo), [products]);
  const nonPromos = useMemo(
    () =>
      products
        .filter((p) => !p.promo)
        .filter((p) => {
          const q = search.trim().toLowerCase();
          if (!q) return true;
          return (
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        }),
    [products, search],
  );

  const totals = useMemo(() => {
    const totalSavings = promos.reduce(
      (acc, p) => acc + (p.price - effectivePrice(p)),
      0,
    );
    const avgDiscount =
      promos.length > 0
        ? Math.round(promos.reduce((a, p) => a + (p.discount ?? 0), 0) / promos.length)
        : 0;
    return { totalSavings, avgDiscount };
  }, [promos, effectivePrice]);

  return (
    <div className="space-y-6">
      {/* Stats das promoções */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5" /> Produtos em promoção
            </p>
            <p className="mt-2 text-3xl font-extrabold text-primary">{promos.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
              Desconto médio
            </p>
            <p className="mt-2 text-3xl font-extrabold">{totals.avgDiscount}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
              Economia total ofertada
            </p>
            <p className="mt-2 text-3xl font-extrabold">{formatPrice(totals.totalSavings)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Promoções ativas */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            Promoções ativas
          </h2>
          <Badge variant="secondary">{promos.length}</Badge>
        </div>

        {promos.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center text-muted-foreground">
              <Flame className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="font-semibold">Nenhuma promoção ativa no momento</p>
              <p className="text-sm">
                Promova um produto da lista abaixo para destacá-lo na vitrine.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {promos.map((p) => (
              <PromoCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Adicionar promoções */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Promover produtos
          </h2>
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground flex items-center gap-2 cursor-pointer">
              <Switch
                checked={showOnlyEligible}
                onCheckedChange={setShowOnlyEligible}
              />
              Mostrar lista
            </label>
          </div>
        </div>

        {showOnlyEligible && (
          <>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produto para promover..."
                className="pl-9"
              />
            </div>

            {nonPromos.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Nenhum produto disponível para promover.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {nonPromos.map((p) => (
                  <AddPromoCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
