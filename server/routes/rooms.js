import express from "express";
import pool from "../configDB/db.js";

const router = express.Router();

// 🔍 GET all rooms
router.get("/", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM Rooms");
    conn.release();
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// 🔍 GET rooms by id
router.get("/:id", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.query("SELECT * FROM Rooms WHERE RoomID = ?", [req.params.id]);
    conn.release();

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});



// ➕ POST (create) a new room
router.post("/", async (req, res) => {
  const {
    HotelID,
    RoomNumber,
    RoomType,
    Floor,
    Capacity,
    PricePerNight,
    Amenities,
    IsAvailable,
  } = req.body;

  try {
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      `INSERT INTO Rooms 
      (HotelID, RoomNumber, RoomType, Floor, Capacity, PricePerNight, Amenities, IsAvailable)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        HotelID,
        RoomNumber,
        RoomType,
        Floor,
        Capacity,
        PricePerNight,
        Amenities,
        IsAvailable,
      ]
    );
    conn.release();

    res.status(201).json({ RoomID: result.insertId });
  } catch (err) {
    console.error("❌ Error creating room:", err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// ✏️ PUT (update) an existing room
router.put("/:id", async (req, res) => {
  const roomId = req.params.id;
  const {
    RoomNumber,
    RoomType,
    Floor,
    Capacity,
    PricePerNight,
    Amenities,
    IsAvailable,
  } = req.body;

  try {
    const conn = await pool.getConnection();

    // 🔍 Get existing room data
    const [existingRows] = await conn.query(
      "SELECT * FROM Rooms WHERE RoomID = ?",
      [roomId]
    );

    if (existingRows.length === 0) {
      conn.release();
      return res.status(404).json({ error: "Room not found" });
    }

    const existingRoom = existingRows[0];

    // ✅ Use existing values if the new ones are null or undefined
    const updatedRoomNumber = RoomNumber ?? existingRoom.RoomNumber;
    const updatedRoomType = RoomType ?? existingRoom.RoomType;
    const updatedFloor = Floor ?? existingRoom.Floor;
    const updatedCapacity = Capacity ?? existingRoom.Capacity;
    const updatedPricePerNight = PricePerNight ?? existingRoom.PricePerNight;
    const updatedAmenities = Amenities ?? existingRoom.Amenities;
    const updatedIsAvailable = IsAvailable ?? existingRoom.IsAvailable;

    // 🛠️ Perform update
    await conn.query(
      `UPDATE Rooms SET 
        RoomNumber = ?, RoomType = ?, Floor = ?, Capacity = ?, 
        PricePerNight = ?, Amenities = ?, IsAvailable = ?
      WHERE RoomID = ?`,
      [
        updatedRoomNumber,
        updatedRoomType,
        updatedFloor,
        updatedCapacity,
        updatedPricePerNight,
        updatedAmenities,
        updatedIsAvailable,
        roomId,
      ]
    );

    conn.release();
    res.json({ message: "Room updated successfully" });

  } catch (err) {
    console.error("❌ Error updating room:", err);
    res.status(500).json({ error: "Failed to update room" });
  }
});

// ❌ DELETE a room
router.delete("/:id", async (req, res) => {
  const roomId = req.params.id;

  try {
    const conn = await pool.getConnection();
    await conn.query("DELETE FROM Rooms WHERE RoomID = ?", [roomId]);
    conn.release();
    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting room:", err);
    res.status(500).json({ error: "Failed to delete room" });
  }
});

export default router;
