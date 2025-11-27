/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/Dashboard.tsx
import { useEffect, useState } from "react"; // --- BARU ---
import api from "../../api"; // --- BARU ---
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, ShoppingBag, Box, ArrowUp } from "lucide-react";

const formatRupiah = (number: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

// Tipe data untuk dashboard (sesuaikan dengan API)
type DashboardStats = {
  totalPendapatan: number;
  pesananBaru: number;
  stokHabis: number;
  totalProduk: number;
  totalPembeli: number;
  produkTerjual: number;
  produkTerlaris: any[];
  transaksiTerakhir: any[];
};

const Dashboard = () => {
  // Warna gold dari logo
  const goldColor = "#b99556";

  // --- STATE BARU ---
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/admin/dashboard-stats");
        setStats(response.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);
  // --- AKHIR STATE BARU ---

  // Tampilkan loading jika data belum siap
  if (isLoading || !stats) {
    return <div>Loading dashboard data...</div>;
  }

  // Data dummy untuk chart (ini bisa kamu ganti dengan API lain nanti)
  const chartData = [
    { name: "Jan", "Jumlah Pembeli": 10 },
    { name: "Feb", "Jumlah Pembeli": 20 },
    // ...
  ];

  return (
    <div className="space-y-6">
      {/* Bagian 1: Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Pendapatan */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Pendapatan
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatRupiah(stats.totalPendapatan)}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                <ArrowUp size={14} />
                <span>23%</span>
                {/* (Ini masih statis, perlu API terpisah) */}
                <span className="text-gray-500">dibandingkan bulan lalu</span>
              </div>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <DollarSign size={22} />
            </div>
          </div>
        </div>

        {/* Card 2: Pesanan Baru (Gold) */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          style={{ backgroundColor: "#FBF3E6", borderColor: "#EED9B1" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pesanan Baru</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pesananBaru}
              </p>
            </div>
            <div
              className="rounded-full bg-yellow-100 p-3 text-yellow-600"
              style={{ backgroundColor: "#F5E4C3", color: "#B99556" }}
            >
              <ShoppingBag size={22} />
            </div>
          </div>
        </div>

        {/* Card 3: Stok Barang (Biru) */}
        <div
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          style={{ backgroundColor: "#E6F0F9", borderColor: "#B1D0ED" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Stok Barang Habis
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.stokHabis}
              </p>
            </div>
            <div
              className="rounded-full bg-blue-100 p-3 text-blue-600"
              style={{ backgroundColor: "#C4DDF5", color: "#3A86D9" }}
            >
              <Box size={22} />
            </div>
          </div>
        </div>

        {/* Card 4: Ringkasan Produk (dari Inventory.jpg) */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Jumlah Produk</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProduk}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-purple-600">
              <Box size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 2: Chart & Ringkasan */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Jumlah Pembeli
          </h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <defs>
                  <linearGradient id="colorPembeli" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5E4C3" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#F5E4C3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Jumlah Pembeli"
                  stroke="#b99556"
                  fillOpacity={1}
                  fill="url(#colorPembeli)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kolom Kanan: Ringkasan */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h4 className="text-md font-semibold text-gray-900">
              Ringkasan Produk
            </h4>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Jumlah Produk</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalProduk}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Kategori Produk</span>
                <span className="text-sm font-medium text-gray-900">15</span>
                {/* (Ini masih statis, perlu API) */}
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h4 className="text-md font-semibold text-gray-900">
              Ringkasan Penjualan
            </h4>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Pembeli</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.totalPembeli}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Produk Terjual</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats.produkTerjual}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian 3: Tabel */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tabel 1: Produk Terlaris */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Produk Terlaris
            </h3>
            <a
              href="#"
              className="text-sm font-medium"
              style={{ color: goldColor }}
            >
              View All
            </a>
          </div>
          <div className="mt-4 flow-root">
            <ul role="list" className="divide-y divide-gray-200">
              {stats.produkTerlaris.map((prod) => (
                <li key={prod.name} className="py-3">
                  <div className="flex items-center space-x-4">
                    <div className="shrink-0">
                      <img
                        className="h-10 w-10 rounded-md object-cover"
                        src={prod.image_url || "/Home/bata.jpg"}
                        alt={prod.name}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {prod.name}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {formatRupiah(prod.price)}
                        {/* (API kita tidak kirim harga, bisa ditambah) */}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {prod.terjual}
                      </p>
                      <p className="text-sm text-gray-500">Terjual</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tabel 2: Transaksi Terakhir */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Transaksi Terakhir
            </h3>
            <a
              href="#"
              className="text-sm font-medium"
              style={{ color: goldColor }}
            >
              View All
            </a>
          </div>
          <div className="mt-4 flow-root">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 sm:pl-0"
                    >
                      Pesanan
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500"
                    >
                      Nama
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500"
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {stats.transaksiTerakhir.map((tx) => (
                    <tr key={tx.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          {/* (Data pesanan & gambar masih statis, perlu API) */}
                          <div className="h-10 w-10 shrink-0">
                            <img
                              className="h-10 w-10 rounded-md"
                              src="/path/to/semen.jpg"
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              Pesanan #{tx.id}
                            </div>
                            <div className="text-gray-500">
                              {new Date(tx.order_date).toLocaleDateString(
                                "id-ID"
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {tx.customer_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                        {formatRupiah(tx.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
