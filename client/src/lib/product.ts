import { products } from "../data/products";
import type { Product } from "../types/product";

// Fungsi untuk mendapatkan semua produk
export const getAllProducts = (): Product[] => {
  return products;
};

// Fungsi untuk mencari produk berdasarkan nama
export const searchProducts = (keyword: string): Product[] => {
  return products.filter((product) => product.name.toLowerCase().includes(keyword.toLowerCase()));
};

// Fungsi untuk mendapatkan produk berdasarkan kategori
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category?.toLowerCase() === category.toLowerCase());
};

// Fungsi untuk mendapatkan produk diskon
export const getDiscountedProducts = (): Product[] => {
  return products.filter((product) => product.oldPrice);
};

// Fungsi untuk mendapatkan produk stok habis
export const getOutOfStockProducts = (): Product[] => {
  return products.filter((product) => product.stock === 0);
};
