import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { products as defaultProducts, type Product } from "@/data/products";
import {
  fetchProducts,
  apiSaveProduct,
  apiDeleteProduct,
  apiClearProducts,
  apiSeedProducts,
  type ApiProduct,
} from "@/lib/api";

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

const toApi = (p: ManagedProduct): ApiProduct => ({
  id: p.id,
  name: p.name,
  price: p.price,
  category: p.category,
  description: p.description,
  image: p.image,
  compatibility: p.compatibility,
  promo: !!p.promo,
  discount: p.discount ?? 0,
  promoTag: p.promoTag ?? "",
});

type ProductsContextType = {
  products: ManagedProduct[];
  categories: string[];
  promos: ManagedProduct[];
  /** true quando o banco de dados da hospedagem está conectado */
  apiOn: boolean;
  /** true quando a API respondeu, mas ainda não há produtos no banco */
  serverEmpty: boolean;
  addProduct: (p: Omit<ManagedProduct, "id"> & { id?: string }) => ManagedProduct;
  updateProduct: (id: string, patch: Partial<ManagedProduct>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
  /** Envia o catálogo atual para o banco de dados da hospedagem */
  syncToServer: () => Promise<void>;
  /** Retorna o preço final aplicando desconto se houver */
  effectivePrice: (p: ManagedProduct) => number;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ManagedProduct[]>(() => loadFromStorage());
  const [apiOn, setApiOn] = useState(false);
  const [serverEmpty, setServerEmpty] = useState(false);

  // Cache local sempre atualizado (fallback offline)
  useEffect(() => {
    persist(items);
  }, [items]);

  // Ao carregar, tenta buscar os produtos do banco de dados da hospedagem
  useEffect(() => {
    let cancelled = false;
    fetchProducts().then((remote) => {
      if (cancelled || remote === null) return;
      setApiOn(true);
      if (remote.length > 0) {
        setItems(remote as ManagedProduct[]);
        setServerEmpty(false);
      } else {
        setServerEmpty(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Sincronia entre abas (modo local)
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

  const addProduct: ProductsContextType["addProduct"] = useCallback(
    (p) => {
      const id =
        p.id?.trim() ||
        `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newProduct: ManagedProduct = { ...p, id } as ManagedProduct;
      setItems((prev) => [newProduct, ...prev]);
      if (apiOn) apiSaveProduct(toApi(newProduct)).catch(() => {});
      return newProduct;
    },
    [apiOn],
  );

  const updateProduct: ProductsContextType["updateProduct"] = useCallback(
    (id, patch) => {
      setItems((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
        if (apiOn) {
          const updated = next.find((p) => p.id === id);
          if (updated) apiSaveProduct(toApi(updated)).catch(() => {});
        }
        return next;
      });
    },
    [apiOn],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((p) => p.id !== id));
      if (apiOn) apiDeleteProduct(id).catch(() => {});
    },
    [apiOn],
  );

  const resetToDefaults = useCallback(() => {
    const defaults = seed();
    setItems(defaults);
    if (apiOn) {
      apiClearProducts()
        .then(() => apiSeedProducts(defaults.map(toApi)))
        .then(() => setServerEmpty(false))
        .catch(() => {});
    }
  }, [apiOn]);

  const syncToServer = useCallback(async () => {
    await apiSeedProducts(items.map(toApi));
    setServerEmpty(false);
  }, [items]);

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
      apiOn,
      serverEmpty,
      addProduct,
      updateProduct,
      deleteProduct,
      resetToDefaults,
      syncToServer,
      effectivePrice,
    }),
    [items, categories, promos, apiOn, serverEmpty, addProduct, updateProduct, deleteProduct, resetToDefaults, syncToServer, effectivePrice],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside ProductsProvider");
  return ctx;
};
