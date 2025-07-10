import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core";
import "./Calendar.css"; // Add some styling
import { BASE_URL } from "@/api/api";
interface Reservation {
  ReservationID: number;
  HotelID: number;
  GuestID: number;
  RoomIDs: string; // e.g. "101"
  CheckInDate: string;
  CheckOutDate: string;
  NumberOfGuests: number;
  Status: string;
}

export const ReservationCalendar = () => {
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/reservations`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch reservations");
        return res.json();
      })
      .then((data: Reservation[]) => {
        const mapped = data.map((res) => ({
          id: String(res.ReservationID),
          title: `Room ${res.RoomIDs} - Guest ${res.GuestID} (${res.Status})`,
          start: res.CheckInDate,
          end: res.CheckOutDate,
          allDay: true,
          backgroundColor: res.Status === "Confirmed" ? "#22c55e" : "#facc15",
          borderColor: "#00000022",
        }));
        setEvents(mapped);
      })
      .catch((err) => {
        console.error("Reservation fetch error:", err);
      });
  }, []);

  return (
    <div className="calendar-wrapper light-theme">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        events={events}
        displayEventTime={false}
        height="auto"
      />
    </div>
  );
};
