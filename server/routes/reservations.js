import express from "express";
import pool from "../configDB/db.js";
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();

// 🔍 GET all reservations
router.get("/", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM Reservations");
    conn.release();

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching reservations:", err);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

// ➕ POST (create) a reservation
router.post("/", async (req, res) => {
  const {
    HotelID,
    FirstName,
    LastName,
    PhoneNumber,
    Email,
    Identification,
    RoomIDs,
    CheckInDate,
    CheckOutDate,
    NumberOfGuests,
    Status,
  } = req.body;

  try {
    const conn = await pool.getConnection();
  
    // Check if the guest already exists
    const [guestRows] = await conn.query(
      "SELECT GuestID FROM Guests WHERE PhoneNumber = ? OR Email = ? OR Identification = ?",
      [PhoneNumber, Email, Identification]
    );
  
    let GuestID;
  
    if (guestRows.length > 0) {
      // If the guest exists, use their ID
      GuestID = guestRows[0].GuestID;
    } else {
      // If the guest does not exist, create a new guest
      const [insertResult] = await conn.query(
        "INSERT INTO Guests (HotelID, FirstName, LastName, PhoneNumber, Email, Identification) VALUES (?, ?, ?, ?, ?, ?)",
        [HotelID,FirstName,LastName, PhoneNumber, Email, Identification]
      );
      GuestID = insertResult.insertId;
    }
    let   ReservationID = uuidv4(); // Generate a unique ReservationID
    const [result] = await conn.query(
      `INSERT INTO Reservations 
        (ReservationID,HotelID, GuestID, RoomIDs, CheckInDate, CheckOutDate, NumberOfGuests, Status)
        VALUES (?,?, ?, ?, ?, ?, ?, ?)`,
      [
        ReservationID,
        HotelID,
        GuestID,
        RoomIDs,
        CheckInDate,
        CheckOutDate,
        NumberOfGuests,
        Status,
      ]
    );
    conn.release();

    res.status(201).json({ ReservationID: ReservationID, GuestID: GuestID });
  } catch (err) {
    console.error("❌ Error creating reservation:", err);
    res.status(500).json({ error: "Failed to create reservation" });
  }
});

// ✏️ PUT (update) a reservation
router.put("/:id", async (req, res) => {
  const reservationId = req.params.id;
  const {
    HotelID,
    GuestID,
    RoomIDs,
    CheckInDate,
    CheckOutDate,
    NumberOfGuests,
    Status,
  } = req.body;

  try {
    const conn = await pool.getConnection();
    await conn.query(
      `UPDATE Reservations SET 
        HotelID = ?, GuestID = ?, RoomIDs = ?, CheckInDate = ?, 
        CheckOutDate = ?, NumberOfGuests = ?, Status = ?
      WHERE ReservationID = ?`,
      [
        HotelID,
        GuestID,
        RoomIDs,
        CheckInDate,
        CheckOutDate,
        NumberOfGuests,
        Status,
        reservationId,
      ]
    );
    conn.release();

    res.json({ message: "Reservation updated successfully" });
  } catch (err) {
    console.error("❌ Error updating reservation:", err);
    res.status(500).json({ error: "Failed to update reservation" });
  }
});

// ❌ DELETE a reservation
router.delete("/:id", async (req, res) => {
  const reservationId = req.params.id;

  try {
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM Reservations WHERE ReservationID = ?", [
      reservationId,
    ]);
    conn.release();

    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting reservation:", err);
    res.status(500).json({ error: "Failed to delete reservation" });
  }
});

export default router;
