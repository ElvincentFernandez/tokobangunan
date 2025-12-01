// client/src/pages/Contact.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";
type FormData = {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
};

    const Contact: React.FC = () => {
      const [formData, setFormData] = useState<FormData>({
        nama: "",
        email: "",
        subjek: "",
        pesan: "",
      });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name as keyof FormData]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim data ke server");
      }

      const result = await response.json();
      alert(result.message);

      // ✅ RESET FORM SETELAH BERHASIL
      setFormData({
        nama: "",
        email: "",
        subjek: "",
        pesan: "",
      });

    } catch (error) {
      console.error("ERROR FETCH:", error);
      alert("Backend tidak dapat dihubungi. Pastikan server hidup.");
    }
  };



  return (
    <div className="bg-white">
      {/* 1. Hero Section (Contact) */}
      <section
        className="relative h-[300px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
        // Ganti dengan URL gambar header kontak kamu
        style={{
          backgroundImage: "url('/Home/furniture.jpg')",
        }}
      >
        {/* --- INI GRADIENT ABU-ABU (HITAM) BARU --- */}
        {/* Ini overlay gradient abu-abu gelap, dari bawah (60%) ke atas (30%) */}
        {/* Ini akan menggelapkan gambar 'furniture.jpg' kamu agar teks putihnya kontras */}
        <div className="absolute inset-0 bg-linear-to-t from-gray-100/60 to-gray-50/30"></div>

        {/* Ini wrapper untuk konten di tengah, di atas overlay */}
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl text-gray-800">Contact</h1>
          <nav className="text-sm text-gray-800 mt-2 font-medium">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span>Contact</span>
          </nav>
        </div>
      </section>

      {/* 2. Main Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          {/* Judul */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Hubungi Kami
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-base lg:text-lg">
              Untuk Informasi lebih lanjut tentang produk dan layanan kami,
              jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda
              kapan saja.
            </p>
          </div>
          {/* Grid: Info + Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
            {/* Kolom Kiri: Info */}
            <div className="flex flex-col justify-center space-y-10">
              {/* Info Item: Alamat */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-1">
                  {/* Asumsi 'text-brand-primary' ada di tailwind.config.js kamu */}
                  <MapPin size={22} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Alamat
                  </h3>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    Jl. Meruyung Raya No.111
                    <br />
                    Kec. Limo, Kota Depok
                    <br />
                    Jawa Barat, 16514
                    <br />
                    Indonesia
                  </p>
                </div>
              </div>

              {/* Info Item: Telepon */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-1">
                  <Phone size={22} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Telepon
                  </h3>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    +(62) 812-8810-824
                  </p>
                </div>
              </div>

              {/* Info Item: Waktu Kerja */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 pt-1">
                  <Clock size={22} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Waktu Kerja
                  </h3>
                  <p className="text-gray-600 mt-1 leading-relaxed">
                    Setiap Hari
                    <br />
                    08:00 - 17:00 WIB
                  </p>
                </div>
              </div>
            </div>{" "}
            {/* End Kolom Kiri */}
            {/* Kolom Kanan: Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Nama Anda */}
              <div>
                <label
                  htmlFor="nama"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Nama Anda
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  placeholder="Nama Lengkap"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full px-1 py-2 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-b-2 focus:border-brand-primary transition duration-200"
                />
              </div>

              {/* Alamat Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Alamat Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Alamat Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-1 py-2 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-b-2 focus:border-brand-primary transition duration-200"
                />
              </div>

              {/* Subjek */}
              <div>
                <label
                  htmlFor="subjek"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Subjek
                </label>
                <input
                  type="text"
                  id="subjek"
                  name="subjek"
                  placeholder="Kepentingan / Terkait (Opsional)"
                  value={formData.subjek}
                  onChange={handleChange}
                  className="w-full px-1 py-2 bg-transparent border-0 border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-b-2 focus:border-brand-primary transition duration-200"
                />
              </div>

              {/* Pesan */}
              <div>
                <label
                  htmlFor="pesan"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Pesan
                </label>
                <textarea
                  id="pesan"
                  name="pesan"
                  rows={5}
                  placeholder="Halo, saya ingin bertanya mengenai..."
                  value={formData.pesan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition duration-200"
                ></textarea>
              </div>

              {/* Tombol Send */}
              <div>
                <button type="submit"
                  className="px-10 py-3 bg-[#9e6621] cursor-pointer text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-opacity duration-200"
                >
                  Send
                </button>
              </div>
            </form>
            {/* End Kolom Kanan */}
          </div>{" "}
          {/* End Grid */}
        </div>{" "}
        {/* End Container */}
      </section>
    </div>
  );
};

export default Contact;
