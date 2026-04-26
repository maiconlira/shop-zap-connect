import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Pencil } from "lucide-react";
import { useProducts, type ManagedProduct } from "@/hooks/useProducts";

type PromoManagerProps = {
  onEditProduct: (product: ManagedProduct) => void;
};

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const PromoManager = ({ onEditProduct }: PromoManagerProps) => {
  const { promos, updateProduct, effectivePrice } = useProducts();

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
            <Flame className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary font-bold text-xs tracking-widest uppercase">
              Promoções da Home
            </span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold">Destaques em Promoção</h2>
        </div>
        <Badge className="bg-primary text-primary-foreground hover:bg-primary px-3 py-1">
          {promos.length} {promos.length === 1 ? "produto" : "produtos"}
        </Badge>
      </div>

      {promos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum produto em promoção.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {promos.map((product) => {
            const finalPrice = effectivePrice(product);
            return (
              <Card key={product.id} className="overflow-hidden border-border/60 shadow-card">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                      {product.promoTag?.trim() || "PROMOÇÃO"}
                    </Badge>
                    {!!product.discount && product.discount > 0 && (
                      <Badge className="bg-foreground text-background hover:bg-foreground">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      {product.category}
                    </p>
                    <h3 className="mt-1 font-bold leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                      {!!product.discount && product.discount > 0 && (
                        <span className="text-sm line-through text-muted-foreground">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className="text-2xl font-extrabold text-primary">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-[96px_1fr] gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor={`discount-${product.id}`}>Desconto</Label>
                      <Input
                        id={`discount-${product.id}`}
                        type="number"
                        min="1"
                        max="99"
                        value={product.discount ?? 0}
                        onChange={(e) =>
                          updateProduct(product.id, {
                            discount: Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`tag-${product.id}`}>Etiqueta</Label>
                      <Input
                        id={`tag-${product.id}`}
                        value={product.promoTag ?? ""}
                        onChange={(e) =>
                          updateProduct(product.id, { promoTag: e.target.value })
                        }
                        placeholder="PROMOÇÃO"
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => onEditProduct(product)}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar produto
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};
