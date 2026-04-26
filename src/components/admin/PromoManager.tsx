import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Flame, Search, Sparkles, X } from "lucide-react";
import { useProducts, type ManagedProduct } from "@/hooks/useProducts";
import { toast } from "sonner";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const PromoManager = () => {
  const { products, updateProduct, effectivePrice } = useProducts();
  const [search, setSearch] = useState("");
  const [onlyPromos, setOnlyPromos] = useState(false);

  const promosCount = useMemo(
    () => products.filter((p) => p.promo).length,
    [products],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (onlyPromos && !p.promo) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, search, onlyPromos]);

  const togglePromo = (p: ManagedProduct, value: boolean) => {
    updateProduct(p.id, {
      promo: value,
      // Garante um desconto mínimo ao ativar pela primeira vez
      discount: value ? (p.discount && p.discount > 0 ? p.discount : 10) : p.discount,
    });
    toast.success(value ? "Promoção ativada" : "Promoção desativada", {
      description: p.name,
    });
  };

  const updateDiscount = (p: ManagedProduct, value: number) => {
    const clean = Number.isNaN(value) ? 0 : Math.max(0, Math.min(99, value));
    updateProduct(p.id, { discount: clean });
  };

  const updateTag = (p: ManagedProduct, value: string) => {
    updateProduct(p.id, { promoTag: value });
  };

  return (
    <Card>
      <CardContent className="p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-primary font-bold text-[11px] tracking-widest uppercase">
                Gerenciar Promoções
              </span>
            </div>
            <h2 className="mt-2 text-xl font-extrabold">
              Defina os destaques de promoção
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Ative o switch para mostrar o produto na seção{" "}
              <span className="font-semibold text-foreground">
                Destaques em Promoção
              </span>{" "}
              da home. Ajuste o desconto (%) e a etiqueta como quiser.
            </p>
          </div>
          <Badge className="bg-primary/15 text-primary hover:bg-primary/15 self-start text-sm px-3 py-1">
            <Flame className="h-3.5 w-3.5 mr-1.5" />
            {promosCount}{" "}
            {promosCount === 1 ? "produto em promoção" : "produtos em promoção"}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto pelo nome ou categoria..."
              className="pl-9"
            />
          </div>
          <Button
            variant={onlyPromos ? "default" : "outline"}
            onClick={() => setOnlyPromos((v) => !v)}
            className="sm:w-auto"
          >
            {onlyPromos ? (
              <>
                <X className="h-4 w-4" />
                Mostrar todos
              </>
            ) : (
              <>
                <Flame className="h-4 w-4" />
                Só em promoção
              </>
            )}
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="w-[110px]">Em promo</TableHead>
                <TableHead className="w-[120px]">Desconto (%)</TableHead>
                <TableHead className="w-[200px]">Etiqueta</TableHead>
                <TableHead className="w-[150px] text-right">Preço final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-10 text-muted-foreground"
                  >
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => {
                  const finalPrice = effectivePrice(p);
                  return (
                    <TableRow key={p.id} className={p.promo ? "bg-primary/5" : ""}>
                      <TableCell>
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-sm line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.category} · {formatPrice(p.price)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            id={`promo-${p.id}`}
                            checked={!!p.promo}
                            onCheckedChange={(v) => togglePromo(p, v)}
                          />
                          <Label
                            htmlFor={`promo-${p.id}`}
                            className="cursor-pointer text-xs text-muted-foreground"
                          >
                            {p.promo ? "Sim" : "Não"}
                          </Label>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="99"
                          value={p.discount ?? 0}
                          onChange={(e) =>
                            updateDiscount(p, parseInt(e.target.value, 10))
                          }
                          disabled={!p.promo}
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={p.promoTag ?? ""}
                          onChange={(e) => updateTag(p, e.target.value)}
                          disabled={!p.promo}
                          placeholder="Ex: OFERTA RELÂMPAGO"
                          className="h-9"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {p.promo && p.discount && p.discount > 0 ? (
                          <div className="space-y-0.5">
                            <p className="text-xs line-through text-muted-foreground">
                              {formatPrice(p.price)}
                            </p>
                            <p className="font-bold text-primary">
                              {formatPrice(finalPrice)}
                            </p>
                          </div>
                        ) : (
                          <p className="font-semibold text-sm">
                            {formatPrice(p.price)}
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
