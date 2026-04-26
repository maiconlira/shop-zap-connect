import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { phoneBrands, phoneModels } from "@/data/phones";
import { cn } from "@/lib/utils";
import { Search, Smartphone, X } from "lucide-react";

const ALL = "todos";

export const ProductGallery = () => {
  const { products, categories } = useProducts();
  const [active, setActive] = useState("Todos");
  const [brand, setBrand] = useState<string>(ALL);
  const [modelId, setModelId] = useState<string>(ALL);
  const [query, setQuery] = useState("");

  const availableModels = useMemo(
    () => (brand === ALL ? phoneModels : phoneModels.filter((m) => m.brand === brand)),
    [brand],
  );

  const phoneFilterActive = brand !== ALL || modelId !== ALL || query.trim().length > 0;

  const filtered = useMemo(() => {
    let list = products;

    // Categoria
    if (active !== "Todos") {
      list = list.filter((p) => p.category === active);
    }

    // Filtro por celular ativo => esconde universais (sem compatibility)
    if (phoneFilterActive) {
      list = list.filter((p) => p.compatibility && p.compatibility.length > 0);
    }

    // Marca: mantém produtos compatíveis com qualquer modelo dessa marca
    if (brand !== ALL) {
      const brandModelIds = new Set(
        phoneModels.filter((m) => m.brand === brand).map((m) => m.id),
      );
      list = list.filter((p) =>
        p.compatibility?.some((id) => brandModelIds.has(id)),
      );
    }

    // Modelo específico
    if (modelId !== ALL) {
      list = list.filter((p) => p.compatibility?.includes(modelId));
    }

    // Busca livre por modelo (nome do modelo) ou produto
    const q = query.trim().toLowerCase();
    if (q) {
      const matchingModelIds = new Set(
        phoneModels
          .filter(
            (m) =>
              m.name.toLowerCase().includes(q) ||
              m.brand.toLowerCase().includes(q),
          )
          .map((m) => m.id),
      );
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.compatibility?.some((id) => matchingModelIds.has(id)),
      );
    }

    return list;
  }, [active, brand, modelId, query, phoneFilterActive]);

  const clearPhoneFilter = () => {
    setBrand(ALL);
    setModelId(ALL);
    setQuery("");
  };

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
          Filtre pelo seu celular e veja tudo que temos para o seu modelo.
        </p>
      </div>

      {/* Filtro por celular */}
      <div className="mx-auto max-w-4xl mb-8 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Encontre para o seu celular
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_220px_auto] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por modelo ou produto..."
              className="pl-9"
            />
          </div>
          <Select
            value={brand}
            onValueChange={(v) => {
              setBrand(v);
              setModelId(ALL);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas as marcas</SelectItem>
              {phoneBrands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger>
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos os modelos</SelectItem>
              {availableModels.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={clearPhoneFilter}
            disabled={!phoneFilterActive}
            className="md:w-auto"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>

      {/* Filtro por categoria */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={active === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActive(cat)}
            className={cn("rounded-full", active === cat && "shadow-soft")}
          >
            {cat}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-semibold">
            Nenhum produto encontrado para esse filtro.
          </p>
          <p className="text-sm mt-2">
            Tente outro modelo ou fale conosco no WhatsApp para encomendar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
