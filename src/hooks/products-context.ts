import { createContext } from "react";
import type { ManagedProduct } from "@/hooks/useProducts";

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
