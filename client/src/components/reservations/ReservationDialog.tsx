import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format, isWithinInterval, parseISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Reservation {
  id?: string;
  roomNumber: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled";
  phone: string;
  email?: string;
  idType: "Aadhar" | "PAN" | "Driving License" | "Passport";
  idNumber: string;
  totalAmount: number;
  advancePaid: number;
}

interface Room {
  roomNumber: string;
  type: string;
  price: number;
}

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation?: Partial<Reservation>;
  initialData?: Partial<Reservation>;
  onSave: (reservation: Reservation) => void;
  availableRooms: Room[];
}

// Mock data for existing reservations (in a real app, this would come from a DB)
const existingReservations = [
  {
    roomNumber: "101",
    checkIn: "2023-06-10",
    checkOut: "2023-06-15"
  },
  {
    roomNumber: "101",
    checkIn: "2023-06-20",
    checkOut: "2023-06-25"
  },
  {
    roomNumber: "102",
    checkIn: "2023-06-05",
    checkOut: "2023-06-12"
  }
];

export function ReservationDialog({ open, onOpenChange, reservation, initialData, onSave, availableRooms }: ReservationDialogProps) {
  const today = new Date();
  
  // Use initialData, reservation, or default values in that order of priority
  const getInitialState = (): Partial<Reservation> => {
    if (initialData) return initialData;
    if (reservation) return reservation;
    
    return {
      roomNumber: "",
      guestName: "",
      checkIn: format(today, 'yyyy-MM-dd'),
      checkOut: format(new Date(today.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      status: "confirmed" as const,
      phone: "",
      email: "",
      idType: "Aadhar" as const,
      idNumber: "",
      totalAmount: 0,
      advancePaid: 0
    };
  };
  
  const [formState, setFormState] = React.useState<Partial<Reservation>>(getInitialState());

  // Reset form state when dialog opens or initialData changes
  React.useEffect(() => {
    if (open) {
      setFormState(getInitialState());
      setCheckInDate(initialData?.checkIn ? new Date(initialData.checkIn) : 
                    reservation?.checkIn ? new Date(reservation.checkIn) : today);
      setCheckOutDate(initialData?.checkOut ? new Date(initialData.checkOut) : 
                      reservation?.checkOut ? new Date(reservation.checkOut) : 
                      new Date(today.getTime() + 24 * 60 * 60 * 1000));
    }
  }, [open, initialData, reservation]);

  const [checkInDate, setCheckInDate] = React.useState<Date>(
    initialData?.checkIn ? new Date(initialData.checkIn) :
    reservation?.checkIn ? new Date(reservation.checkIn) : today
  );
  
  const [checkOutDate, setCheckOutDate] = React.useState<Date>(
    initialData?.checkOut ? new Date(initialData.checkOut) :
    reservation?.checkOut ? new Date(reservation.checkOut) : 
    new Date(today.getTime() + 24 * 60 * 60 * 1000)
  );
  
  // State for selected room reservations
  const [selectedRoomReservations, setSelectedRoomReservations] = React.useState<Array<{checkIn: Date, checkOut: Date}>>([]);

  const { toast } = useToast();

  // Update selected room reservations when room changes
  React.useEffect(() => {
    if (formState.roomNumber) {
      const roomReservations = existingReservations
        .filter(res => res.roomNumber === formState.roomNumber)
        .map(res => ({
          checkIn: parseISO(res.checkIn),
          checkOut: parseISO(res.checkOut)
        }));
      setSelectedRoomReservations(roomReservations);
    } else {
      setSelectedRoomReservations([]);
    }
  }, [formState.roomNumber]);

  const handleChange = (field: keyof Reservation, value: any) => {
    setFormState((prev) => {
      // Type safety for the status field
      if (field === "status") {
        const statusValue = value as "confirmed" | "checked-in" | "checked-out" | "cancelled";
        return { ...prev, [field]: statusValue };
      }
      
      // Handle ID type with type safety
      if (field === "idType") {
        const idTypeValue = value as "Aadhar" | "PAN" | "Driving License" | "Passport";
        return { ...prev, [field]: idTypeValue };
      }
      
      // All other fields
      const updated = { ...prev, [field]: value };
      
      // If room is selected, calculate the total amount
      if (field === "roomNumber" && value) {
        const selectedRoom = availableRooms.find(room => room.roomNumber === value);
        if (selectedRoom) {
          // Calculate number of days
          const checkIn = new Date(updated.checkIn || today);
          const checkOut = new Date(updated.checkOut || today);
          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000));
          
          updated.totalAmount = selectedRoom.price * Math.max(1, nights);
          updated.advancePaid = Math.round(selectedRoom.price * 0.3); // 30% advance
        }
      }
      
      // Recalculate if dates change
      if ((field === "checkIn" || field === "checkOut") && updated.roomNumber) {
        const selectedRoom = availableRooms.find(room => room.roomNumber === updated.roomNumber);
        if (selectedRoom) {
          const checkIn = new Date(updated.checkIn || today);
          const checkOut = new Date(updated.checkOut || today);
          const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (24 * 60 * 60 * 1000));
          
          updated.totalAmount = selectedRoom.price * Math.max(1, nights);
        }
      }
      
      return updated;
    });
  };

  const handleCheckInSelect = (date: Date | undefined) => {
    if (date) {
      setCheckInDate(date);
      handleChange("checkIn", format(date, 'yyyy-MM-dd'));
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    if (date) {
      setCheckOutDate(date);
      handleChange("checkOut", format(date, 'yyyy-MM-dd'));
    }
  };

  // Function to check if a date is booked (in an existing reservation)
  const isDateBooked = (date: Date) => {
    return selectedRoomReservations.some(reservation => 
      isWithinInterval(date, { 
        start: reservation.checkIn, 
        end: new Date(reservation.checkOut.getTime() - 1) // Exclude checkout date
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.roomNumber) {
      toast({
        title: "Error",
        description: "Please select a room",
        variant: "destructive",
      });
      return;
    }

    if (!formState.guestName) {
      toast({
        title: "Error",
        description: "Guest name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formState.phone) {
      toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return;
    }

    if (!formState.idNumber) {
      toast({
        title: "Error",
        description: "ID number is required",
        variant: "destructive",
      });
      return;
    }

    // Ensure status is one of the allowed values
    const validStatus = formState.status as "confirmed" | "checked-in" | "checked-out" | "cancelled";
    
    // Create a valid reservation object with proper typing
    const validReservation: Reservation = {
      roomNumber: formState.roomNumber!,
      guestName: formState.guestName!,
      checkIn: formState.checkIn!,
      checkOut: formState.checkOut!,
      status: validStatus || "confirmed",
      phone: formState.phone!,
      email: formState.email,
      idType: formState.idType as "Aadhar" | "PAN" | "Driving License" | "Passport",
      idNumber: formState.idNumber!,
      totalAmount: formState.totalAmount || 0,
      advancePaid: formState.advancePaid || 0,
    };

    onSave(validReservation);
    onOpenChange(false);
  };

  // Format price with rupee symbol
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{reservation?.id ? "Edit Reservation" : "New Reservation"}</DialogTitle>
            <DialogDescription>
              {reservation?.id ? "Update reservation details below." : "Fill in the details for the new reservation."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <Select 
                value={formState.roomNumber} 
                onValueChange={(value) => handleChange("roomNumber", value)}
              >
                <SelectTrigger id="room" className="col-span-3">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableRooms.map(room => (
                      <SelectItem key={room.roomNumber} value={room.roomNumber}>
                        {room.roomNumber} - {room.type} ({formatPrice(room.price)}/night)
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guest-name" className="text-right">
                Guest Name
              </Label>
              <Input
                id="guest-name"
                value={formState.guestName || ""}
                onChange={(e) => handleChange("guestName", e.target.value)}
                className="col-span-3"
                placeholder="Guest full name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={formState.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="col-span-3"
                placeholder="10-digit mobile number"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formState.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3"
                placeholder="Optional"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id-type" className="text-right">
                ID Type
              </Label>
              <Select 
                value={formState.idType as string} 
                onValueChange={(value) => handleChange("idType", value)}
              >
                <SelectTrigger id="id-type" className="col-span-3">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="PAN">PAN Card</SelectItem>
                  <SelectItem value="Driving License">Driving License</SelectItem>
                  <SelectItem value="Passport">Passport</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id-number" className="text-right">
                ID Number
              </Label>
              <Input
                id="id-number"
                value={formState.idNumber || ""}
                onChange={(e) => handleChange("idNumber", e.target.value)}
                className="col-span-3"
                placeholder="ID document number"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Check-in</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={handleCheckInSelect}
                      initialFocus
                      disabled={(date) => date < today || isDateBooked(date)}
                      className="p-3 pointer-events-auto"
                      modifiers={{
                        booked: (date) => isDateBooked(date),
                      }}
                      modifiersClassNames={{
                        booked: "bg-red-100 text-red-800 opacity-50",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Check-out</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={handleCheckOutSelect}
                      disabled={(date) => date <= checkInDate || isDateBooked(date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      modifiers={{
                        booked: (date) => isDateBooked(date),
                      }}
                      modifiersClassNames={{
                        booked: "bg-red-100 text-red-800 opacity-50",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total-amount" className="text-right">
                Total Amount
              </Label>
              <Input
                id="total-amount"
                type="number"
                value={formState.totalAmount || 0}
                onChange={(e) => handleChange("totalAmount", Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="advance" className="text-right">
                Advance Paid
              </Label>
              <Input
                id="advance"
                type="number"
                value={formState.advancePaid || 0}
                onChange={(e) => handleChange("advancePaid", Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={formState.status as string} 
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="checked-out">Checked Out</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{reservation?.id ? "Save Changes" : "Create Reservation"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
