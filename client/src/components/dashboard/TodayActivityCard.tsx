
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckSquare, LogIn, LogOut } from "lucide-react";

export function TodayActivityCard() {
  const todayCheckIns = [
    { id: "B1001", guestName: "David Mitchell", roomNumber: "201", time: "14:00" },
    { id: "B1002", guestName: "Sarah Johnson", roomNumber: "305", time: "15:30" },
    { id: "B1003", guestName: "James Wilson", roomNumber: "104", time: "16:00" },
  ];

  const todayCheckOuts = [
    { id: "B0995", guestName: "Thomas Harris", roomNumber: "207", time: "10:00" },
    { id: "B0996", guestName: "Emily Clark", roomNumber: "310", time: "11:00" },
    { id: "B0997", guestName: "Alexander Lee", roomNumber: "105", time: "12:00" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Activity</CardTitle>
        <CardDescription>Scheduled check-ins and check-outs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LogIn size={18} className="text-green-500" />
            <h3 className="font-semibold">Check-ins</h3>
          </div>
          <div className="space-y-3">
            {todayCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{checkIn.guestName}</p>
                  <p className="text-sm text-muted-foreground">Room {checkIn.roomNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{checkIn.time}</p>
                  <p className="text-xs text-muted-foreground">Booking #{checkIn.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />
        
        <div>
          <div className="flex items-center gap-2 mb-4">
            <LogOut size={18} className="text-blue-500" />
            <h3 className="font-semibold">Check-outs</h3>
          </div>
          <div className="space-y-3">
            {todayCheckOuts.map((checkOut) => (
              <div key={checkOut.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{checkOut.guestName}</p>
                  <p className="text-sm text-muted-foreground">Room {checkOut.roomNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{checkOut.time}</p>
                  <p className="text-xs text-muted-foreground">Booking #{checkOut.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
