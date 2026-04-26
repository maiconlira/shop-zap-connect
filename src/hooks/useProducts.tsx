import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { products as defaultProducts, type Product } from "@/data/products";

export type ManagedProduct = Product & {
  /** Marca o produto como destaque na seção de promoções */
  promo?: boolean;
  /** Desconto em % aplicado quando promo === true (0-100) */
  discount?: number;
  /** Texto opcional para a etiqueta da promoção */
  promoTag?: string;
};

const STORAGE_KEY = "smartcell:products:v2";

// Promoções iniciais — produtos em destaque já marcados como promo
const DEFAULT_PROMOS: Record<string, { discount: number; promoTag?: string }> = {
  "fone-tws": { discount: 25, promoTag: "MAIS VENDIDO" },
  "carregador-turbo": { discount: 20, promoTag: "OFERTA RELÂMPAGO" },
  "caixa-som-bluetooth": { discount: 15, promoTag: "SUPER OFERTA" },
  "powerbank-10000": { discount: 18, promoTag: "FRETE GRÁTIS" },
  "garrafa-termica-preta": { discount: 30, promoTag: "QUEIMA DE ESTOQUE" },
  "copo-tumbler": { discount: 22, promoTag: "ÚLTIMAS UNIDADES" },
};

const seed = (): ManagedProduct[] =>
  defaultProducts.map((p) => {
    const promo = DEFAULT_PROMOS[p.id];
    return promo ? { ...p, promo: true, ...promo } : { ...p };
  });

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

type ProductsContextType = {
  products: ManagedProduct[];
  categories: string[];
  promos: ManagedProduct[];
  addProduct: (p: Omit<ManagedProduct, "id"> & { id?: string }) => ManagedProduct;
  updateProduct: (id: string, patch: Partial<ManagedProduct>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
  /** Retorna o preço final aplicando desconto se houver */
  effectivePrice: (p: ManagedProduct) => number;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

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
