import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './configDB/db.js';
import roomRoutes from "./routes/rooms.js";
import reservationRoutes from "./routes/reservations.js";
import analyticsRoutes from "./routes/analytics.js";
import guestsRoutes from "./routes/guests.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Test database connection
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() AS now');
    res.json({ message: 'Database connected!', time: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.use(express.json());

// 🔍 Route to fetch data from all tables (for testing)
app.get('/test-data', async (req, res) => {
  try {
    const conn = await pool.getConnection();

    const tables = [
      'Hotels',
      'Guests',
      'Rooms',
      'Reservations',
      'Invoices',
      'Staff',
      'ActivityServiceDetails',
      'RestaurantServiceDetails',
      'RoomServiceDetails',
      'HotelServices'
    ];

    const results = {};
    for (const table of tables) {
      const [rows] = await conn.query(`SELECT * FROM ${table}`);
      results[table] = rows;
    }

    conn.release();
    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/api/guests", guestsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

