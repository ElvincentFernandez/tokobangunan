// src/pages/Home.tsx
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white">
      {/* --- 1. Hero Section --- */}
      {/* Ganti '/images/hero-bg.jpg' dengan path gambar toko kamu */}
      <section
        className="relative h-[650px] bg-cover bg-center bg-no-repeat flex items-center"
        style={{
          backgroundImage: "url('/assets/images/mandiri.png')",
        }}
      >

        <div className="absolute inset-0"></div>
        <div className="container mx-auto px-6 h-full flex items-center justify-end">
          <div className="relative bg-[#f9ddbc] p-8 rounded-lg shadow-lg max-w-md">
            <h1 className="text-4xl font-bold text-[#9e6621] my-3">
              Harga Terbaik Untuk Material Pilihan
            </h1>
            <p className="text-gray-600 mb-6">
              Solusi cepat dan terjangkau untuk semua kebutuhan renovasi dan
              pembangunan Anda.
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-[#9e6621] text-white font-semibold shadow-md hover:opacity-75 transition-colors"
            >
              BELI SEKARANG
            </Link>
          </div>
        </div>
      </section>

      {/* --- 2. Kategori Section --- */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Telusuri Kategori Kami
          </h2>
          <p className="text-gray-600 mb-10">
            Jelajahi kebutuhan material Anda dari kategori kami.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kategori 1: Bata */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src="/Home/bata.jpg"
                alt="Bata"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Bata</h3>
              </div>
            </div>
            {/* Kategori 2: Besi */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src="/Home/besi.png"
                alt="Besi"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Besi</h3>
              </div>
            </div>
            {/* Kategori 3: Semen */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src="/Home/semen.jpg"
                alt="Semen"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Semen</h3>
              </div>
            </div>
          </div>

          <Link
            to="/products"
            className="mt-12 inline-block px-8 py-3 border border-[#b57b35] text-[#b57b35] font-semibold rounded-md hover:bg-gray-50 hover:opacity-50 transition-colors"
          >
            Selengkapnya
          </Link>
        </div>
      </section>

      {/* --- 3. Pengiriman Section --- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Teks */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Pengiriman Material Ke Seluruh Jabodetabek
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Kami menyediakan pengiriman material bangunan ke seluruh wilayah
              Jakarta, Bogor, Depok, Tangerang, dan Bekasi (Jabodetabek). Dari
              material dasar seperti semen, pasir, dan bata, hingga material
              finishing, kami pastikan pesanan cepat dan tepat waktu ke lokasi
              Anda.
            </p>
          </div>

          {/* Gambar - Nanti bisa diganti slider */}

          <div className="grid grid-cols-3 gap-4">
            {/* Gambar 1: Jakarta */}
            <div className="relative rounded-2xl overflow-hidden h-80">
              <img
                src="/Home/mandiri3.jpg"
                alt="Jakarta"
                className="w-full h-full object-cover"
              />
              {/* 1. Gradient Overlay (Gelap di bawah ke transparan di atas) */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              {/* 2. Teks (Diposisikan di bawah tengah) */}
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <span className="text-white text-2xl font-bold">Jakarta</span>
              </div>
            </div>

            {/* Gambar 2: Bogor */}
            <div className="relative rounded-2xl overflow-hidden h-80">
              <img
                src="/Home/mandiri4.jpg"
                alt="Bogor"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <span className="text-white text-2xl font-bold">Bogor</span>
              </div>
            </div>

            {/* Gambar 3: Depok */}
            <div className="relative rounded-2xl overflow-hidden h-80">
              <img
                src="/Home/mandiri6.jpg"
                alt="Depok"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              <div className="absolute inset-0 flex items-end justify-center pb-6">
                <span className="text-white text-2xl font-bold">Depok</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. Gallery #MaterialMandiri Section --- */}
      <section>
        <div className="container mx-auto ">
          <div className="text-center mb-10">
            <p className="text-gray-600">
              Bangun Proyek Konstruksi Anda dengan
            </p>
            <h2 className="text-4xl font-bold text-gray-800">
              #MaterialMandiri
            </h2>
          </div>

          {/* Grid Foto Mosaik */}
          <div
            className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/Home/mandiri1.png')" }}
          ></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
