
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled";
}

const statusColorMap = {
  confirmed: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  "checked-in": "bg-green-100 text-green-800 hover:bg-green-100",
  "checked-out": "bg-blue-100 text-blue-800 hover:bg-blue-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function RecentBookingsTable() {
  const recentBookings: Booking[] = [
    {
      id: "B1234",
      guestName: "John Smith",
      roomNumber: "101",
      checkIn: "2023-06-10",
      checkOut: "2023-06-15",
      status: "confirmed",
    },
    {
      id: "B1235",
      guestName: "Emma Wilson",
      roomNumber: "205",
      checkIn: "2023-06-08",
      checkOut: "2023-06-12",
      status: "checked-in",
    },
    {
      id: "B1236",
      guestName: "Michael Brown",
      roomNumber: "304",
      checkIn: "2023-06-09",
      checkOut: "2023-06-11",
      status: "checked-out",
    },
    {
      id: "B1237",
      guestName: "Sophia Lee",
      roomNumber: "402",
      checkIn: "2023-06-12",
      checkOut: "2023-06-16",
      status: "cancelled",
    },
    {
      id: "B1238",
      guestName: "Robert Davis",
      roomNumber: "103",
      checkIn: "2023-06-11",
      checkOut: "2023-06-13",
      status: "checked-in",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Bookings</CardTitle>
        <CardDescription>List of the latest reservations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>{booking.roomNumber}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{booking.checkOut}</TableCell>
                  <TableCell>
                    <Badge className={statusColorMap[booking.status]}>
                      {booking.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
