// src/components/Navbar.tsx
import { Link } from "react-router-dom";
import { User, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { openCart, cartItems } = useCart();
  const totalItems = cartItems.length;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      <nav className="w-full px-6 py-4 flex items-center justify-between">

          {/* KIRI - LOGO */}
            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <img
                src="/assets/images/logo.png"
                alt="Mandiri Steel Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-bold text-[#b99556]">
                Mandiri Steel
              </span>
            </Link>

          {/* TENGAH - MENU BENAR-BENAR CENTER */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-gray-900 font-medium">
                Products
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 font-medium">
                Contact
              </Link>
            </div>
          </div>

          {/* KANAN - ICON + LOGIN REGISTER */}
          <div className="flex items-center gap-5">

            {/* ICON USER & CART (RAPAT) */}
            <div className="flex items-center gap-2">
              <Link to="/profile" className="text-gray-600 hover:text-gray-900 cursor-pointer">
                <User size={22} />
              </Link>

              <button
                onClick={openCart}
                className="text-gray-600 hover:text-gray-900 relative cursor-pointer"
              >
                <ShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* LOGIN & REGISTER - POJOK KANAN */}
            <div className="flex gap-2">
              <Link
                to="/admin/login"
                className="bg-[#9e6621] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#7a4f17] transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-[#9e6621] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#7a4f17] transition"
              >
                Register
              </Link>
            </div>
          </div>

        </nav>
    </header>
  );
};

export default Navbar;
