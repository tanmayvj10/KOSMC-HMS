import express from "express";
import pool from "../configDB/db.js";
import { v4 as uuidv4 } from 'uuid';
import e from "express";

const router = express.Router();

// 🔍 GET all guests sort by IsActive
router.get("/", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM Guests ORDER BY IsActive DESC");
    conn.release();

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching guests:", err);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
});

export default router;