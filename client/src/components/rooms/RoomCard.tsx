
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Wifi, Tv, Wind, Coffee, Thermometer, Waves, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { max } from "date-fns";

export type RoomStatus = "available" | "occupied" | "maintenance" | "reserved";

export interface Room {
  id: string;
  number: string;
  type: string;
  floor: string;
  status: RoomStatus;
  price: number;
  capacity: number;
  amenities: string;
}

interface RoomCardProps {
  room: Room;
  onStatusChange: (id: string, status: RoomStatus) => void;
  onBook: (id: string) => void;
}

// Get amenity icon based on the amenity name
const getAmenityIcon = (amenity: string) => {
  const normalizedAmenity = amenity.toLowerCase();
  
  if (normalizedAmenity.includes('wifi')) return <Wifi size={14} />;
  if (normalizedAmenity.includes('tv') || normalizedAmenity.includes('television')) return <Tv size={14} />;
  if (normalizedAmenity.includes('ac') || normalizedAmenity.includes('air')) return <Wind size={14} />;
  if (normalizedAmenity.includes('coffee')) return <Coffee size={14} />;
  if (normalizedAmenity.includes('heat')) return <Thermometer size={14} />;
  if (normalizedAmenity.includes('jacuzzi') || normalizedAmenity.includes('spa')) return <Waves size={14} />;
  
  return null;
};

export const RoomCard = ({ room, onStatusChange, onBook }: RoomCardProps) => {
  const statusColorMap: Record<RoomStatus, string> = {
    available: "bg-green-500 hover:bg-green-600",
    occupied: "bg-red-500 hover:bg-red-600",
    maintenance: "bg-amber-500 hover:bg-amber-600",
    reserved: "bg-blue-500 hover:bg-blue-600",
  };

  const statusText: Record<RoomStatus, string> = {
    available: "Available",
    occupied: "Occupied",
    maintenance: "Maintenance",
    reserved: "Reserved",
  };

  // Generate a QR code URL that redirects to a room-specific link
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://kosmc-hotel.com/room/${room.number}`;

  return (
    <Card className="room-card h-full">
      <CardContent className="p-0 flex flex-col h-full" style={{ width:"95%"}}>
        <div className="flex justify-between items-start p-4">
          <div>
            <h3 className="text-lg font-bold">Room {room.number}</h3>
            <div className="text-muted-foreground mb-1">{room.type} · {room.floor}</div>
            <div className="font-medium">₹{room.price}/night</div>
            <div className="text-sm text-muted-foreground">Max {room.capacity} {room.capacity > 1 ? "guests" : "guest"}</div>
            {room.amenities && (
          <div className="pt-0 mt-auto">
            <div className="text-xs text-muted-foreground mb-1 mt-1">Amenities:</div>
            <div className="flex flex-wrap gap-1">
              {room.amenities.split('+').map(item => item.trim()).map((amenity, index) => (
                <Badge 
                  key={`${room.id}-${index}`} 
                  variant="outline" 
                  className="flex items-center gap-1 text-xs py-0"
                >
                  {getAmenityIcon(amenity)}
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}
          </div>
          
          <div className="flex flex-col items-end gap-2" style = {{ marginLeft: "1rem"}}>
            <Badge 
              className={cn(
                "rounded-full text-white", 
                statusColorMap[room.status]
              )}
            >
              {statusText[room.status]}
            </Badge>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <QrCode size={14} />
                  Room QR
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Room {room.number} QR Code</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-4">
                  <img src={qrCodeUrl} alt={`QR Code for Room ${room.number}`} className="w-48 h-48" />
                  <p className="text-sm text-muted-foreground mt-4">
                    Scan to access room information and services
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  Change Status
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusChange(room.id, "available")}>
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(room.id, "occupied")}>
                  Occupied
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(room.id, "maintenance")}>
                  Maintenance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(room.id, "reserved")}>
                  Reserved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="default" 
              size="sm"
              disabled={room.status !== "available"}
              onClick={() => onBook(room.id)}
            >
              {room.status === "available" ? "Book Room" : "Unavailable"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
