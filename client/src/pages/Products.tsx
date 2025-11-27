// client/src/pages/Products.tsx
import { Link } from "react-router-dom";
import { Filter, LayoutGrid, List } from "lucide-react";

// --- Data Produk (Contoh) ---
const products = [
  {
    id: 1,
    name: "Bata Hebel",
    stock: 800,
    price: 2500000,
    oldPrice: 3500000,
    imageUrl: "https://placehold.co/300x300/e0e0e0/757575?text=Bata+Hebel",
    badge: { type: "discount", text: "30%" },
  },
  {
    id: 2,
    name: "Bata Merah",
    stock: 1240,
    price: 2500000,
    imageUrl: "https://placehold.co/300x300/e67e22/ffffff?text=Bata+Merah",
  },
  {
    id: 3,
    name: "Batako",
    stock: 0,
    price: 5000000,
    imageUrl: "https://placehold.co/300x300/7f8c8d/ffffff?text=Batako",
  },
  {
    id: 4,
    name: "Bata Roster",
    stock: 230,
    price: 7000000,
    imageUrl: "https://placehold.co/300x300/ecf0f1/757575?text=Bata+Roster",
    badge: { type: "new", text: "New" },
  },
  {
    id: 5,
    name: "Besi Beton",
    stock: 625,
    price: 2500000,
    imageUrl: "https://placehold.co/300x300/bdc3c7/757575?text=Besi+Beton",
  },
  {
    id: 6,
    name: "Besi Wiremesh",
    stock: 220,
    price: 2500000,
    imageUrl: "https://placehold.co/300x300/bdc3c7/757575?text=Wiremesh",
  },
  {
    id: 7,
    name: "Besi Hollow",
    stock: 110,
    price: 7000000,
    oldPrice: 14000000,
    imageUrl: "https://placehold.co/300x300/95a5a6/ffffff?text=Hollow",
  },
  {
    id: 8,
    name: "Besi Siku",
    stock: 75,
    price: 5000000,
    imageUrl: "https://placehold.co/300x300/95a5a6/ffffff?text=Siku",
  },
  {
    id: 9,
    name: "Semen Putih",
    stock: 40,
    price: 2500000,
    imageUrl: "https://placehold.co/300x300/ecf0f1/e74c3c?text=Semen+Putih",
    badge: { type: "discount", text: "30%" },
  },
  {
    id: 10,
    name: "Semen Abu",
    stock: 0,
    price: 2500000,
    imageUrl: "https://placehold.co/300x300/f0f0f0/757575?text=Semen+Abu",
    showHover: true,
  },
  {
    id: 11,
    name: "Kayu Balok",
    stock: 190,
    price: 7000000,
    oldPrice: 14000000,
    imageUrl: "https://placehold.co/300x300/f39c12/ffffff?text=Kayu+Balok",
    badge: { type: "discount", text: "60%" },
  },
  {
    id: 12,
    name: "Triplek",
    stock: 170,
    price: 5000000,
    imageUrl: "https://placehold.co/300x300/f1c40f/757575?text=Triplek",
  },
];

// --- Komponen Product Card ---
type ProductCardProps = {
  product: (typeof products)[0];
};

const ProductCard = ({ product }: ProductCardProps) => {
  const formatRupiah = (number: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  return (
    <div className="group relative bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image box mirip lampiran: ada padding di sekitar gambar */}
      <div className="p-4 bg-white flex items-center justify-center">
        <div className="relative w-full" style={{ paddingTop: "100%" }}>
          {/* badge */}
          {product.badge && (
            <span
              className={`absolute top-2 right-2 z-20 inline-flex items-center justify-center text-xs font-bold rounded-full px-2 py-1
                ${
                  product.badge.type === "new"
                    ? "bg-[#3ac47d] text-white"
                    : "bg-[#ff6b6b] text-white"
                }
              `}
            >
              {product.badge.text}
            </span>
          )}

          {/* image */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* hover overlay for add to cart (Semen Abu) */}
          {product.showHover && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button className="px-4 py-2 bg-white rounded text-gray-800 font-semibold">
                Add to chart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>
        <p className="text-xs text-gray-400 mt-1">
          Stok: {product.stock || "-"}
        </p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-base font-bold text-gray-900">
              {formatRupiah(product.price)}
            </p>
            {product.oldPrice && (
              <p className="text-xs text-gray-400 line-through">
                {formatRupiah(product.oldPrice)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Halaman Produk Utama ---
const Products = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Header besar (mirip lampiran) */}
      <section
        className="relative h-[300px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "url('/Home/besi.png')",
        }}
      >
        {/* Overlay gelap sesuai gambar */}
        <div className="absolute inset-0 bg-linear-to-t from-gray-100/60 to-gray-50/30"></div>

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl text-gray-800">Product</h1>

          <nav className="text-sm text-gray-800 mt-2 font-medium flex items-center gap-2">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span>&gt;</span>
            <span>Product</span>
          </nav>
        </div>
      </section>

      {/* 2. Filter bar (peach background like lampiran) */}
      <section className="sticky top-[72px] z-40">
        <div className="container mx-auto px-6">
          <div className="bg-[#e7d7b1] border border-[#f0e4df] rounded-md px-4 py-3 mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-3 py-2rounded-md text-sm text-gray-700">
                <Filter size={16} />
                <span>Filter</span>
              </button>

              <div className="flex items-cente rounded-md overflow-hidden">
                <button className="p-2 bg-gray-900 text-white">
                  <LayoutGrid size={16} />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-50">
                  <List size={16} />
                </button>
              </div>

              <span className="text-sm text-gray-800 hidden lg:block">
                Menampilkan 1–16 dari 48 hasil
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="show-count" className="text-sm text-gray-700">
                  Menunjukkan
                </label>
                <select
                  id="show-count"
                  className="px-2 py-2 rounded-md text-sm focus:outline-none bg-white"
                >
                  <option value="16">16</option>
                  <option value="32">32</option>
                  <option value="48">48</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-sm text-gray-700">
                  Urut berdasarkan
                </label>
                <select
                  id="sort-by"
                  className="px-2 py-2 bg-white rounded-md text-sm focus:outline-none"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Harga (Murah)</option>
                  <option value="price-desc">Harga (Mahal)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Grid produk */}
      <section className="py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* pagination */}
          <div className="mt-8 flex justify-center">
            <ul className="flex items-center gap-3">
              <li>
                <a
                  href="#"
                  className="px-4 py-2 rounded-md font-semibold text-white bg-[#b5872a] border border-[#b5872a]"
                >
                  1
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="px-4 py-2 rounded-md font-semibold text-gray-700 border border-gray-300 bg-white"
                >
                  2
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="px-4 py-2 rounded-md font-semibold text-gray-700 border border-gray-300 bg-white"
                >
                  3
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="px-4 py-2 rounded-md font-semibold text-gray-700 border border-gray-300 bg-white"
                >
                  Next
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Products;
