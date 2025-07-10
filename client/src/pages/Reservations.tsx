
import { useState } from "react";
import { ReservationCalendar } from "@/components/reservations/ReservationCalendar";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReservationDialog } from "@/components/reservations/ReservationDialog";
import { ReservationTable } from "@/components/reservations/ReservationTable";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock available rooms (shared with Rooms component to maintain sync)
const availableRooms = [
  { roomNumber: "101", type: "Standard", price: 1499 },
  { roomNumber: "102", type: "Standard", price: 1499 },
  { roomNumber: "201", type: "Deluxe", price: 2499 },
  { roomNumber: "202", type: "Deluxe", price: 2499 },
  { roomNumber: "301", type: "Suite", price: 3999 },
];

const Reservations = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [initialReservationData, setInitialReservationData] = useState<any>(null);
  const { toast } = useToast();
  
  const handleNewReservation = () => {
    setInitialReservationData(null);
    setDialogOpen(true);
  };
  
  const handleCalendarBooking = (date: Date, roomNumber: string) => {
    // Find the room details
    const room = availableRooms.find(r => r.roomNumber === roomNumber);
    if (!room) return;
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Set initial data for the reservation dialog
    setInitialReservationData({
      roomNumber,
      checkIn: format(date, 'yyyy-MM-dd'),
      checkOut: format(nextDay, 'yyyy-MM-dd'),
      totalAmount: room.price,
      advancePaid: room.price * 0.3 // 30% advance
    });
    
    setDialogOpen(true);
  };
  
  const handleSaveReservation = (reservationData: any) => {
    toast({
      title: "Reservation created",
      description: `Booking for ${reservationData.guestName} has been created successfully.`,
    });
    
    // In a real app, we would save this to the database and update the room status
    console.log("New reservation:", reservationData);
  };

  const handleBulkReservation = () => {
    setBulkDialogOpen(true);
  };

  const handleSaveBulkReservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const roomType = formData.get("roomType") as string;
    const roomCount = parseInt(formData.get("roomCount") as string);
    const guestName = formData.get("guestName") as string;
    const checkIn = formData.get("checkIn") as string;
    const checkOut = formData.get("checkOut") as string;
    const guestCount = parseInt(formData.get("guestCount") as string);
    const contactNumber = formData.get("contactNumber") as string;
    const email = formData.get("email") as string;
    const specialRequests = formData.get("specialRequests") as string;
    
    // Get filtered rooms of the selected type
    const filteredRooms = availableRooms.filter(room => room.type === roomType);
    
    if (roomCount > filteredRooms.length) {
      toast({
        title: "Not enough rooms",
        description: `Only ${filteredRooms.length} ${roomType} rooms are available.`,
        variant: "destructive"
      });
      return;
    }
    
    // Calculate the total price
    const roomPrice = filteredRooms[0].price;
    const totalAmount = roomPrice * roomCount;
    
    toast({
      title: "Bulk reservation created",
      description: `${roomCount} ${roomType} rooms have been reserved for ${guestName}.`,
    });
    
    // In a real app, we would save these reservations to the database
    console.log("Bulk reservation:", {
      roomType,
      roomCount,
      guestName,
      checkIn,
      checkOut,
      guestCount,
      contactNumber,
      email,
      specialRequests,
      totalAmount
    });
    
    setBulkDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reservations</h1>
          <p className="text-muted-foreground">Manage guest bookings and reservations</p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-1.5" onClick={handleBulkReservation}>
            <Users size={16} />
            Group Booking
          </Button>
          <Button className="gap-1.5" onClick={handleNewReservation}>
            <Plus size={16} />
            New Reservation
          </Button>
        </div>
      </div>

      <ReservationCalendar/>
      <ReservationTable/>
      <ReservationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveReservation}
        availableRooms={availableRooms}
        initialData={initialReservationData}
      />

      {/* Bulk Reservation Dialog */}
      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Group/Bulk Reservation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveBulkReservation}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="roomType">Room Type</Label>
                  <Select name="roomType" defaultValue="Standard" required>
                    <SelectTrigger id="roomType">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Deluxe">Deluxe</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roomCount">Number of Rooms</Label>
                  <Input id="roomCount" name="roomCount" type="number" min="1" max="10" defaultValue="1" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkIn">Check-in Date</Label>
                  <Input id="checkIn" name="checkIn" type="date" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkOut">Check-out Date</Label>
                  <Input id="checkOut" name="checkOut" type="date" required />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="guestName">Primary Guest Name</Label>
                <Input id="guestName" name="guestName" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="guestCount">Number of Guests</Label>
                  <Input id="guestCount" name="guestCount" type="number" min="1" defaultValue="2" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" name="contactNumber" required />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea id="specialRequests" name="specialRequests" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Group Reservation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reservations;
