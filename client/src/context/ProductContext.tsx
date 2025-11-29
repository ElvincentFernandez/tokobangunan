// src/contexts/ProductContext.tsx
import React, { createContext, type ReactNode } from "react";
import { products } from "../data/products";
import { getAllProducts, getDiscountedProducts, getOutOfStockProducts, getProductsByCategory, searchProducts } from "../lib/product";
import type { Product } from "../types/product";

// Definisikan tipe context
export type ProductContextType = {
  products: Product[];
  getAllProducts: () => Product[];
  searchProducts: (keyword: string) => Product[];
  getProductsByCategory: (category: string) => Product[];
  getDiscountedProducts: () => Product[];
  getOutOfStockProducts: () => Product[];
};

// Buat context dengan default value undefined
// eslint-disable-next-line react-refresh/only-export-components
export const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Props untuk provider
interface ProductProviderProps {
  children: ReactNode;
}

// Component Provider
export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  // Value yang akan disediakan oleh context
  const value: ProductContextType = {
    products,
    getAllProducts,
    searchProducts,
    getProductsByCategory,
    getDiscountedProducts,
    getOutOfStockProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;