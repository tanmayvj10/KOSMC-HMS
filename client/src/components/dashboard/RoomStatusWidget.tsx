
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RoomStatus = "available" | "occupied" | "maintenance" | "reserved";

interface RoomStatusData {
  status: RoomStatus;
  count: number;
  color: string;
}

export function RoomStatusWidget() {
  const roomStatusData: RoomStatusData[] = [
    { status: "available", count: 12, color: "bg-green-500" },
    { status: "occupied", count: 24, color: "bg-blue-500" },
    { status: "reserved", count: 8, color: "bg-yellow-500" },
    { status: "maintenance", count: 4, color: "bg-red-500" },
  ];
  
  const totalRooms = roomStatusData.reduce((acc, item) => acc + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Room Status</CardTitle>
        <CardDescription>Current room availability</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-secondary">
            {roomStatusData.map((item) => (
              <div 
                key={item.status}
                className={`${item.color}`}
                style={{ width: `${(item.count / totalRooms) * 100}%` }}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {roomStatusData.map((item) => (
              <div key={item.status} className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <p className="text-sm font-medium capitalize">{item.status}</p>
                </div>
                <p className="text-xl font-bold">{item.count}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((item.count / totalRooms) * 100)}% of total
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
