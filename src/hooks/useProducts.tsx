import { useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { products as defaultProducts } from "@/data/products";
import { ProductsContext, type ProductsContextType, type ManagedProduct } from "./products-context";

export type { ManagedProduct } from "./products-context";

const STORAGE_KEY = "smartcell:products:v3";

// Configuração inicial de promoções por categoria — pega 1 ou 2 produtos por categoria
// e marca como promo com desconto e etiqueta. Pode ser editado/removido pelo admin depois.
const PROMO_PRESETS: Array<{ category: string; discount: number; tag: string }> = [
  { category: "Capinhas", discount: 25, tag: "MAIS VENDIDO" },
  { category: "Películas", discount: 30, tag: "OFERTA RELÂMPAGO" },
  { category: "Áudio", discount: 20, tag: "SUPER OFERTA" },
  { category: "Carregadores", discount: 15, tag: "FRETE GRÁTIS" },
  { category: "Copos", discount: 18, tag: "QUEIMA DE ESTOQUE" },
  { category: "Garrafas", discount: 22, tag: "EXCLUSIVO" },
];

const seed = (): ManagedProduct[] => {
  const list = defaultProducts.map((p) => ({ ...p }) as ManagedProduct);
  const usedIds = new Set<string>();
  PROMO_PRESETS.forEach(({ category, discount, tag }) => {
    const candidate = list.find(
      (p) => p.category.toLowerCase() === category.toLowerCase() && !usedIds.has(p.id),
    );
    if (candidate) {
      candidate.promo = true;
      candidate.discount = discount;
      candidate.promoTag = tag;
      usedIds.add(candidate.id);
    }
  });
  return list;
};

const loadFromStorage = (): ManagedProduct[] => {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as ManagedProduct[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seed();
    return parsed;
  } catch {
    return seed();
  }
};

const persist = (list: ManagedProduct[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors
  }
};

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ManagedProduct[]>(() => loadFromStorage());

  useEffect(() => {
    persist(items);
  }, [items]);

  // Sincronia entre abas
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setItems(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const addProduct: ProductsContextType["addProduct"] = useCallback((p) => {
    const id =
      p.id?.trim() ||
      `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newProduct: ManagedProduct = { ...p, id } as ManagedProduct;
    setItems((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct: ProductsContextType["updateProduct"] = useCallback(
    (id, patch) => {
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    },
    [],
  );

  const deleteProduct = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    setItems(seed());
  }, []);

  const effectivePrice = useCallback((p: ManagedProduct) => {
    if (p.promo && p.discount && p.discount > 0) {
      return Math.max(0, p.price * (1 - p.discount / 100));
    }
    return p.price;
  }, []);

  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(items.map((p) => p.category)))],
    [items],
  );

  const promos = useMemo(() => items.filter((p) => p.promo), [items]);

  const value = useMemo(
    () => ({
      products: items,
      categories,
      promos,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefaults,
      effectivePrice,
    }),
    [items, categories, promos, addProduct, updateProduct, deleteProduct, resetToDefaults, effectivePrice],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
};
