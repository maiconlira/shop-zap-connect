import { createContext } from "react";
import type { Product } from "@/data/products";

export type ManagedProduct = Product & {
  /** Marca o produto como destaque na seção de promoções */
  promo?: boolean;
  /** Desconto em % aplicado quando promo === true (0-100) */
  discount?: number;
  /** Texto opcional para a etiqueta da promoção */
  promoTag?: string;
};

export type ProductsContextType = {
  products: ManagedProduct[];
  categories: string[];
  promos: ManagedProduct[];
  addProduct: (p: Omit<ManagedProduct, "id"> & { id?: string }) => ManagedProduct;
  updateProduct: (id: string, patch: Partial<ManagedProduct>) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
  effectivePrice: (p: ManagedProduct) => number;
};

export const ProductsContext = createContext<ProductsContextType | null>(null);
