// src/context/CartContext.tsx
import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";


// Tipe data untuk item di keranjang (bisa disesuaikan)
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

// Tipe data untuk
type CartContextType = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: CartItem[];
  // Nanti tambahkan:
  // addToCart: (item: CartItem) => void;
  // removeFromCart: (id: number) => void;
  // updateQuantity: (id: number, quantity: number) => void;
  // cartTotal: number;
};

// Buat Context-nya
const CartContext = createContext<CartContextType | undefined>(undefined);

// Buat Provider (pembungkus)
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- DATA DUMMY (Sesuai Chart.jpg & Checkout.jpg) ---
  // Ganti ini dengan state kosong `[]` saat sudah production
  const [cartItems] = useState<CartItem[]>([
    {
      id: 10,
      name: "Semen Abu",
      price: 2500000,
      quantity: 10,
      imageUrl: "/Home/semen.jpg",
    }, // Ganti path gambarnya
    {
      id: 13,
      name: "Cat Tembok",
      price: 5000000,
      quantity: 5,
      imageUrl: "/path/to/cat-tembok.jpg",
    }, // Ganti path gambarnya
  ]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        cartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Buat hook kustom biar gampang dipanggil
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
