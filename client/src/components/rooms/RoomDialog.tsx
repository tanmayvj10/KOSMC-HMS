import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Room, RoomStatus } from "@/components/rooms/RoomCard";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room;
  onSave: (room: Partial<Room>) => void;
}

// Common amenities for hotel rooms
const availableAmenities = [
  { id: "ac", label: "Air Conditioning" },
  { id: "tv", label: "Television" },
  { id: "wifi", label: "WiFi" },
  { id: "minibar", label: "Mini Bar" },
  { id: "safe", label: "Safe" },
  { id: "jacuzzi", label: "Jacuzzi" },
  { id: "balcony", label: "Balcony" },
  { id: "coffee", label: "Coffee Machine" },
  { id: "desk", label: "Work Desk" },
  { id: "fridge", label: "Refrigerator" },
];

export function RoomDialog({ open, onOpenChange, room, onSave }: RoomDialogProps) {
  const [formState, setFormState] = useState<Partial<Room>>(
    room ?? {
      number: "",
      type: "Standard",
      floor: "1",
      status: "available",
      price: 1499,
      capacity: 2,
      amenities:"AC+TV+WiFi"  //["AC", "TV", "WiFi"] //string
    }
  );

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    room?.amenities?.split('+').map(item => item.trim()).map(a => a.toLowerCase()) || ["ac", "tv", "wifi"] //STRING TO ARRAY
  );

  // For bulk creation
  const [bulkRooms, setBulkRooms] = useState({
    startNumber: "101",
    count: 5,
    floor: "1",
    type: "Standard",
    status: "available" as RoomStatus,
    price: 1499,
    capacity: 2
  });

  const { toast } = useToast();

  const handleChange = (field: keyof Room, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenityId: string, isChecked: boolean) => {
    setSelectedAmenities(prev => {
      if (isChecked) {
        return [...prev, amenityId];
      } else {
        return prev.filter(a => a !== amenityId);
      }
    });
  };

  const handleBulkChange = (field: string, value: any) => {
    setBulkRooms(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.number) {
      toast({
        title: "Error",
        description: "Room number is required",
        variant: "destructive",
      });
      return;
    }

    // Map selected amenity IDs to proper formatted amenities
    const amenities = selectedAmenities.map(id => {
      const amenity = availableAmenities.find(a => a.id === id);
      return amenity ? amenity.label : id.charAt(0).toUpperCase() + id.slice(1);
    }).join("+");

    onSave({ ...formState, amenities });
    onOpenChange(false);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bulkRooms.startNumber || !bulkRooms.count || bulkRooms.count <= 0) {
      toast({
        title: "Error",
        description: "Starting room number and count are required",
        variant: "destructive",
      });
      return;
    }

    // Generate rooms in bulk
    const baseRoomNumber = parseInt(bulkRooms.startNumber.replace(/\D/g, ''));
    if (isNaN(baseRoomNumber)) {
      toast({
        title: "Error",
        description: "Invalid starting room number",
        variant: "destructive",
      });
      return;
    }

    // Format the non-numeric prefix if any
    const prefix = bulkRooms.startNumber.match(/^[^\d]*/)?.[0] || '';
    
    // Create rooms in bulk
    for (let i = 0; i < bulkRooms.count; i++) {
      const roomNumber = `${prefix}${baseRoomNumber + i}`;
      const newRoom = {
        number: roomNumber,
        type: bulkRooms.type,
        floor: bulkRooms.floor,
        status: bulkRooms.status as RoomStatus,
        price: bulkRooms.price,
        capacity: bulkRooms.capacity,
        amenities: selectedAmenities.map(id => {
          const amenity = availableAmenities.find(a => a.id === id);
          return amenity ? amenity.label : id.charAt(0).toUpperCase() + id.slice(1);
        }).join("+"),
      };
      
      onSave(newRoom);
    }
    
    toast({
      title: "Success",
      description: `Created ${bulkRooms.count} rooms starting from ${bulkRooms.startNumber}`,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <Tabs defaultValue={room ? "single" : "single"}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">{room ? "Edit Room" : "Add Single Room"}</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Create Rooms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="single">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{room ? "Edit Room" : "Add New Room"}</DialogTitle>
                <DialogDescription>
                  {room ? "Update room details below." : "Fill in the details for the new room."}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="room-number" className="text-right">
                    Room No
                  </Label>
                  <Input
                    id="room-number"
                    value={formState.number}
                    onChange={(e) => handleChange("number", e.target.value)}
                    className="col-span-3"
                    placeholder="101"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="floor" className="text-right">
                    Floor
                  </Label>
                  <Input
                    id="floor"
                    value={formState.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                    className="col-span-3"
                    placeholder="1"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="room-type" className="text-right">
                    Room Type
                  </Label>
                  <Select 
                    value={formState.type} 
                    onValueChange={(value) => handleChange("type", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price (₹)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formState.price}
                    onChange={(e) => handleChange("price", Number(e.target.value))}
                    className="col-span-3"
                    placeholder="1499"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formState.capacity}
                    onChange={(e) => handleChange("capacity", Number(e.target.value))}
                    className="col-span-3"
                    placeholder="2"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select 
                    value={formState.status} 
                    onValueChange={(value) => handleChange("status", value as RoomStatus)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    Amenities
                  </Label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`amenity-${amenity.id}`}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={(checked) => 
                            handleAmenityChange(amenity.id, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`amenity-${amenity.id}`}
                          className="text-sm font-normal"
                        >
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">{room ? "Save Changes" : "Add Room"}</Button>
              </DialogFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="bulk">
            <form onSubmit={handleBulkSubmit}>
              <DialogHeader>
                <DialogTitle>Bulk Create Rooms</DialogTitle>
                <DialogDescription>
                  Create multiple rooms at once with sequential room numbers.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-number">Starting Room Number</Label>
                    <Input
                      id="start-number"
                      value={bulkRooms.startNumber}
                      onChange={(e) => handleBulkChange("startNumber", e.target.value)}
                      placeholder="101"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room-count">Number of Rooms</Label>
                    <div className="flex items-center mt-1">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleBulkChange("count", Math.max(1, parseInt(bulkRooms.count.toString()) - 1))}
                      >
                        <Minus size={16} />
                      </Button>
                      <Input
                        id="room-count"
                        type="number"
                        min="1"
                        value={bulkRooms.count}
                        onChange={(e) => handleBulkChange("count", parseInt(e.target.value) || 1)}
                        className="mx-2 text-center"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleBulkChange("count", parseInt(bulkRooms.count.toString()) + 1)}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bulk-floor">Floor</Label>
                    <Input
                      id="bulk-floor"
                      value={bulkRooms.floor}
                      onChange={(e) => handleBulkChange("floor", e.target.value)}
                      placeholder="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bulk-type">Room Type</Label>
                    <Select
                      value={bulkRooms.type}
                      onValueChange={(value) => handleBulkChange("type", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Deluxe">Deluxe</SelectItem>
                          <SelectItem value="Suite">Suite</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bulk-price">Price (₹)</Label>
                    <Input
                      id="bulk-price"
                      type="number"
                      value={bulkRooms.price}
                      onChange={(e) => handleBulkChange("price", Number(e.target.value))}
                      placeholder="1499"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bulk-capacity">Capacity</Label>
                    <Input
                      id="bulk-capacity"
                      type="number"
                      value={bulkRooms.capacity}
                      onChange={(e) => handleBulkChange("capacity", Number(e.target.value))}
                      placeholder="2"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bulk-status">Status</Label>
                  <Select
                    value={bulkRooms.status}
                    onValueChange={(value) => handleBulkChange("status", value as RoomStatus)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="block mb-2">Amenities</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`bulk-amenity-${amenity.id}`}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={(checked) => 
                            handleAmenityChange(amenity.id, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`bulk-amenity-${amenity.id}`}
                          className="text-sm font-normal"
                        >
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Create Rooms</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}