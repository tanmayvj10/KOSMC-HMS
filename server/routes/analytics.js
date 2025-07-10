import express from "express";
import pool from "../configDB/db.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const conn = await pool.getConnection();
    // Occupancy Rate
    const [totalRoomsRows] = await conn.query("SELECT COUNT(*) AS total FROM Rooms");
    const [occupiedRoomsRows] = await conn.query("SELECT COUNT(*) AS occupied FROM Rooms WHERE IsAvailable = 'Occupied'");
    const totalRooms = totalRoomsRows[0].total;
    const occupiedRooms = occupiedRoomsRows[0].occupied;
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
    // Give Room Status (Available, Occupied, Maintenance)
    const [roomStatusRows] = await conn.query("SELECT IsAvailable, COUNT(*) AS count FROM Rooms GROUP BY IsAvailable");
    const roomStatus = roomStatusRows.reduce((acc, row) => {
      acc[row.IsAvailable] = row.count;
      return acc;
    }, {});
    // Reservations in last 1 Week
    const [reservationsRows] = await conn.query("SELECT COUNT(*) AS total FROM Reservations WHERE CheckInDate >= NOW() - INTERVAL 7 DAY");
    const totalReservations = reservationsRows[0].total;
    // Revenue in last 1 Week
    const [totalRevenueRows] = await conn.query("SELECT SUM(TotalAmount) AS total FROM Invoices WHERE InvoiceDate >= NOW() - INTERVAL 7 DAY");
    const totalRevenue = totalRevenueRows[0].total || 0;
    // Active Guests
    const [activeGuestsRows] = await conn.query("SELECT COUNT(*) AS total FROM Guests WHERE isActive = 1");
    const activeGuests = activeGuestsRows[0].total;
    // Latest Reservations
    const [latestReservationsRows] = await conn.query("SELECT * FROM Reservations ORDER BY CheckInDate DESC LIMIT 5");
    const latestReservations = latestReservationsRows.map(reservation => {
      return {
        ReservationID: reservation.ReservationID,
        GuestID: reservation.GuestID,
        RoomIDs: reservation.RoomIDs,
        CheckInDate: reservation.CheckInDate,
        CheckOutDate: reservation.CheckOutDate,
        NumberOfGuests: reservation.NumberOfGuests,
        Status: reservation.Status,
      };
    });
    //List of reservation CheckIns Today not the count
    const [checkInsTodayRows] = await conn.query("SELECT * FROM Reservations WHERE CheckInDate = CURDATE()");
    const checkInsToday = checkInsTodayRows.length;
    // CheckIn Today
    const checkInsTodayList = checkInsTodayRows.map(reservation => {
      return {
        ReservationID: reservation.ReservationID,
        GuestID: reservation.GuestID,
        RoomIDs: reservation.RoomIDs,
        CheckInDate: reservation.CheckInDate,
        CheckOutDate: reservation.CheckOutDate,
        NumberOfGuests: reservation.NumberOfGuests,
        Status: reservation.Status,
      };
    });

    // CheckOuts Today
    const [checkOutsTodayRows] = await conn.query("SELECT * FROM Reservations WHERE CheckOutDate = CURDATE()");
    const checkOutsToday = checkOutsTodayRows.length;
    const checkOutsTodayList = checkOutsTodayRows.map(reservation => {
      return {
        ReservationID: reservation.ReservationID,
        GuestID: reservation.GuestID,
        RoomIDs: reservation.RoomIDs,
        CheckInDate: reservation.CheckInDate,
        CheckOutDate: reservation.CheckOutDate,
        NumberOfGuests: reservation.NumberOfGuests,
        Status: reservation.Status,
      };
    });

    conn.release();
    res.json({
        occupancyRate: occupancyRate.toFixed(2),
        totalRooms: totalRooms,
        roomStatus: roomStatus,
        totalReservations: totalReservations,
        totalRevenue: totalRevenue,
        activeGuests: activeGuests,
        latestReservations: latestReservations,
        checkInsToday: checkInsToday,
        checkInsTodayList: checkInsTodayList,
        checkOutsToday: checkOutsToday,
        checkOutsTodayList: checkOutsTodayList,
      });
      
  } catch (err) {
    console.error("❌ Error calculating:", err);
    res.status(500).json({ error: "Failed to calculate analytics" });
  }
});

export default router;
