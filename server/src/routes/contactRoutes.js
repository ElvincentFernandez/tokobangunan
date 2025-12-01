const express = require("express");
const router = express.Router();
const pool = require("../db");

// TEST ENDPOINT
router.get("/", (req, res) => {
  res.json({ message: "Contact API aktif ✅" });
});

// SIMPAN PESAN
router.post("/", async (req, res) => {
  const { nama, email, subjek, pesan } = req.body;

  try {
    await pool.query(
      "INSERT INTO contact (nama, email, subjek, pesan) VALUES (?, ?, ?, ?)",
      [nama, email, subjek, pesan]
    );

    res.json({ message: "Pesan berhasil dikirim ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengirim data ke server" });
  }
});

module.exports = router;
