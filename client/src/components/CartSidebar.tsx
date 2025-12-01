// src/components/CartSidebar.tsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react"; // ✅ Trash2 dihapus
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

// Fungsi format Rupiah
const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

export default function CartSidebar() {
  const { isCartOpen, closeCart, cartItems } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/50 bg-opacity-40 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-sm">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">

                    {/* Header */}
                    <div className="shrink-0 flex items-center justify-between px-4 py-4 sm:px-6 shadow-sm">
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Shopping Cart
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500"
                        onClick={closeCart}
                      >
                        <X size={24} />
                      </button>
                    </div>

                    {/* Daftar Item */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <ul className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.id} className="flex py-4">
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                  <h3>{item.name}</h3>
                                  <button
                                    type="button"
                                    className="font-medium text-gray-400 hover:text-red-500"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">
                                  {formatRupiah(item.price)}
                                </p>
                              </div>

                              <div className="flex flex-1 items-end justify-between text-sm">
                                <p className="text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                                <p className="text-base font-medium text-gray-900">
                                  {formatRupiah(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <p>Subtotal</p>
                        <p>{formatRupiah(subtotal)}</p>
                      </div>
                      <div className="mt-6">
                        <Link
                          to="/checkout"
                          onClick={closeCart}
                          className="flex items-center justify-center rounded-md bg-[#9e6621] px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-90"
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
