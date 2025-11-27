// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";

import Navbar from "./Navbar";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar";
import Chatbot from "./Chatbot";

import { FaRobot, FaTimes } from "react-icons/fa";
import ProductProvider from "../context/ProductContext";

const Layout = () => {
  const [openChat, setOpenChat] = useState(false);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <ProductProvider>
        <Navbar />

        <main className="grow">
          <Outlet />
        </main>

        <Footer />

        <CartSidebar />

        {/* Floating Button */}
        <button
          onClick={() => setOpenChat((prev) => !prev)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-linear-to-r from-blue-600 to-purple-600 shadow-lg text-white flex items-center justify-center z-9999 transition-all duration-300 hover:shadow-xl hover:scale-110"
        >
          {openChat ? <FaTimes size={20} /> : <FaRobot size={20} />}
        </button>

        {/* Widget Chat */}
        {openChat && <Chatbot onClose={() => setOpenChat(false)} />}
      </ProductProvider>
    </div>
  );
};

export default Layout;