export type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  oldPrice?: number;
  imageUrl: string;
  badge?: { type: string; text: string };
  showHover?: boolean;
  category?: string;
};
