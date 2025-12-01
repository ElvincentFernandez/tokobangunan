// server/src/index.js
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Koneksi MySQL kamu
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const app = express();
const PORT = process.env.PORT || 5000;

// Opsi untuk koneksi DB (digunakan oleh session store)
const dbOptions = {
  host: "localhost",
  user: "root",
  password: "",
  database: "toko_bangunan",
};

const sessionStore = new MySQLStore(dbOptions);

// === MIDDLEWARE ===
app.use(
  cors({
    origin: "http://localhost:5173", // Alamat frontend Vite kamu
    credentials: true, // PENTING untuk kirim cookie session
  })
);
app.use(express.json());

// Setup Session
app.use(
  session({
    key: "mandiri_session_id",
    secret: "ini-rahasia-banget-ganti-nanti", // Ganti dengan string acak
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
      httpOnly: true,
      secure: false, // Set 'true' jika pakai HTTPS
      sameSite: "lax", // agar cookie cross-site bisa dikirim
    },
  })
);

// === MIDDLEWARE PROTEKSI ADMIN ===
// Ini adalah "satpam" untuk API admin
const isAdmin = (req, res, next) => {
  if (req.session.adminId) {
    next(); // Lanjut, karena sudah login
  } else {
    res.status(401).json({ message: "Unauthorized: Anda harus login dulu" });
  }
};

/*
 * ============================================
 * API ENDPOINTS (PUBLIK - UNTUK KLIEN/USER)
 * ============================================
 */

// GET /api/products (Sudah ada dari sebelumnya)
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// POST /api/orders (Sudah ada dari sebelumnya)
app.post("/api/orders", async (req, res) => {
  // ... (kode 'POST /api/orders' kamu yang sudah ada)
  // ... (pastikan kodenya ada di sini)
});

/*
 * ============================================
 * API ENDPOINTS (ADMIN - BARU)
 * ============================================
 */

// === 1. ADMIN AUTH API ===

// POST /api/admin/login (Untuk AdminLogin.tsx)
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;

  // --- TAMBAHKAN INI UNTUK DEBUG ---
  console.log("--- UPAYA LOGIN ---");
  console.log("Database yg dituju:", dbOptions.database); // Cek nama DB
  console.log("Data diterima dari Frontend:", req.body);
  // ---------------------------------

  if (!username || !password) {
    console.log("Hasil: Gagal (Username/password dari frontend kosong)");
    return res
      .status(400)
      .json({ message: "Username dan password wajib diisi" });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM admins WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      console.log("Hasil: Gagal (Username tidak ditemukan di database)");
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const admin = rows[0];
    console.log("Data di DB: User ditemukan:", admin.username);
    console.log("Data di DB: Hash password:", admin.password);

    // Cek password
    const isMatch = await bcrypt.compare(
      password.trim(),
      admin.password.trim()
    );

    if (!isMatch) {
      console.log("Hasil: Gagal (Password tidak cocok dengan hash)");
      return res.status(401).json({ message: "Username atau password salah" });
    }

    // SUKSES LOGIN
    console.log("Hasil: SUKSES (Password cocok!)");
    req.session.adminId = admin.id;
    req.session.adminUsername = admin.username;

    // --- PERBAIKAN: Paksa session untuk save SEBELUM kirim respon ---
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Gagal menyimpan sesi login" });
      }

      // Kirim respon HANYA SETELAH session tersimpan
      console.log("Session berhasil disimpan, cookie dikirim.");
      res.status(200).json({
        message: "Login berhasil",
        username: admin.username,
      });
    });
    // --- AKHIR PERBAIKAN ---
  } catch (err) {
    console.error("SERVER ERROR SAAT LOGIN:", err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/admin/profile (Untuk cek status login saat refresh)
app.get("/api/admin/profile", isAdmin, (req, res) => {
  // Jika lolos middleware 'isAdmin', berarti sudah login
  res.status(200).json({
    isLoggedIn: true,
    username: req.session.adminUsername,
  });
});

// POST /api/admin/logout (Untuk tombol Logout)
app.post("/api/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Gagal logout");
    }
    res.clearCookie("mandiri_session_id");
    res.status(200).json({ message: "Logout berhasil" });
  });
});

// === 2. INVENTORY API (CRUD Produk) ===
// Semua rute di bawah ini diproteksi oleh middleware 'isAdmin'

// POST /api/products (Untuk AddProductModal.tsx)
app.post("/api/products", isAdmin, async (req, res) => {
  const { name, description, price, stock, category_id, ...etc } = req.body;
  // (Nanti tambahkan logic upload gambar di sini)
  try {
    const query =
      "INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)";
    const [result] = await pool.execute(query, [
      name,
      description,
      price,
      stock,
      category_id,
    ]);
    res.status(201).json({
      message: "Produk berhasil ditambahkan",
      insertId: result.insertId,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// PUT /api/products/:id (Untuk EditProductModal.tsx)
app.put("/api/products/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category_id, ...etc } = req.body;
  try {
    const query =
      "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category_id = ? WHERE id = ?";
    await pool.execute(query, [
      name,
      description,
      price,
      stock,
      category_id,
      id,
    ]);
    res.status(200).json({ message: "Produk berhasil diperbarui" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// DELETE /api/products/:id
app.delete("/api/products/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
    res.status(200).json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/categories (Untuk dropdown di modal)
app.get("/api/categories", isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// === 3. ORDERS API (Read) ===

// GET /api/orders (Untuk Orders.tsx)
app.get("/api/orders", isAdmin, async (req, res) => {
  try {
    // Ambil semua pesanan, diurutkan dari yang terbaru
    const [rows] = await pool.query(
      "SELECT * FROM orders ORDER BY order_date DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET /api/orders/:id (Untuk OrderDetail.tsx)
app.get("/api/orders/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Ambil detail pesanan utama
    const [orderRows] = await pool.query("SELECT * FROM orders WHERE id = ?", [
      id,
    ]);
    if (orderRows.length === 0) {
      return res.status(404).json({ message: "Pesanan tidak ditemukan" });
    }

    // 2. Ambil semua item di dalam pesanan itu
    const [itemRows] = await pool.query(
      `
      SELECT p.name as product_name, oi.quantity, oi.price_per_unit
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `,
      [id]
    );

    // 3. Gabungkan hasilnya
    const orderDetail = {
      ...orderRows[0],
      items: itemRows,
    };

    res.json(orderDetail);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// === 4. DASHBOARD API (Stats) ===

// GET /api/admin/dashboard-stats (Untuk Dashboard.tsx)
app.get("/api/admin/dashboard-stats", isAdmin, async (req, res) => {
  try {
    // Kita jalankan banyak query sekaligus
    const [
      [pendapatan],
      [pesananBaru],
      [stokHabis],
      [totalProduk],
      [totalPembeli],
      [produkTerjual],
      produkTerlaris,
      transaksiTerakhir,
    ] = await Promise.all([
      // Total Pendapatan (Asumsi 'Selesai' adalah statusnya)
      pool.query(
        "SELECT SUM(total_amount) as total FROM orders WHERE status = 'Selesai'"
      ),
      // Pesanan Baru (Pending)
      pool.query(
        "SELECT COUNT(*) as total FROM orders WHERE status = 'Pending'"
      ),
      // Stok Habis
      pool.query("SELECT COUNT(*) as total FROM products WHERE stock = 0"),
      // Total Produk
      pool.query("SELECT COUNT(*) as total FROM products"),
      // Total Pembeli (Unik)
      pool.query("SELECT COUNT(DISTINCT customer_email) as total FROM orders"),
      // Total Produk Terjual (dari semua order items)
      pool.query("SELECT SUM(quantity) as total FROM order_items"),
      // Produk Terlaris (Top 5)
      pool.query(`
        SELECT p.name, p.image_url, SUM(oi.quantity) as total_terjual
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY p.id
        ORDER BY total_terjual DESC
        LIMIT 5
      `),
      // Transaksi Terakhir (Top 5)
      pool.query(
        "SELECT id, customer_name, total_amount, order_date FROM orders ORDER BY order_date DESC LIMIT 5"
      ),
    ]);

    // Gabungkan semua jadi 1 JSON
    const stats = {
      totalPendapatan: pendapatan[0].total || 0,
      pesananBaru: pesananBaru[0].total || 0,
      stokHabis: stokHabis[0].total || 0,
      totalProduk: totalProduk[0].total || 0,
      totalPembeli: totalPembeli[0].total || 0,
      produkTerjual: produkTerjual[0].total || 0,
      produkTerlaris: produkTerlaris,
      transaksiTerakhir: transaksiTerakhir,
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ================= CONTACT ROUTES =================
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);


// Jalankan server
app.listen(PORT, () => {
  console.log(`Server admin berjalan di http://localhost:${PORT}`);
});
