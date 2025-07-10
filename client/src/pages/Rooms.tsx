import { useState, useEffect } from "react";
import { Room, RoomCard, RoomStatus } from "@/components/rooms/RoomCard";
import { RoomFilterBar, RoomFilters } from "@/components/rooms/RoomFilterBar";
import { Button } from "@/components/ui/button";
import { Plus, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RoomDialog } from "@/components/rooms/RoomDialog";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "@/api/api";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filters, setFilters] = useState<RoomFilters>({
    search: "",
    status: "all",
    type: "",
    floor: ""
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/rooms`);
        const data = await response.json();
        const formatted = data.map((room: any) => ({
          id: String(room.RoomID),
          number: room.RoomNumber,
          type: room.RoomType,
          floor: room.Floor,
          status: room.IsAvailable.toString().toLowerCase(),
          price: room.PricePerNight,
          capacity: room.Capacity,
          amenities: room.Amenities
        }));
        setRooms(formatted);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleFilterChange = (newFilters: RoomFilters) => {
    setFilters(newFilters);
  };

  const handleStatusChange = async (id: string, newStatus: RoomStatus) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === id ? { ...room, status: newStatus } : room
      )
    );
    try {
      const response = await fetch(`${BASE_URL}/api/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // send only the status field or full object as needed
      });
  
      if (!response.ok) throw new Error("Failed to update room status");
  
      toast({
        title: "Room status updated",
        description: `Room status has been changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Status update failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleBookRoom = (id: string) => {
    const room = rooms.find(r => r.id === id);
    
    toast({
      title: "Booking initiated",
      description: `Redirecting to booking page for Room ${room?.number}`,
    });
    
    navigate("/reservations");
  };

  const handleAddRoom = () => {
    setCurrentRoom(undefined);
    setDialogOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setCurrentRoom(room);
    setDialogOpen(true);
  };

  const handleSaveRoom = (roomData: Partial<Room>) => {
    if (currentRoom) {
      setRooms(prevRooms =>
        prevRooms.map(room =>
          room.id === currentRoom.id ? { ...room, ...roomData } : room
        )
      );
      toast({
        title: "Room updated",
        description: `Room ${roomData.number} has been updated successfully.`,
      });
    } else {
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        number: roomData.number || "",
        type: roomData.type || "Standard",
        floor: roomData.floor || "1",
        status: roomData.status || "available",
        price: roomData.price || 1499,
        capacity: roomData.capacity || 2,
        amenities: roomData.amenities || ""
      };
      
      setRooms(prevRooms => [...prevRooms, newRoom]);
      toast({
        title: "Room added",
        description: `Room ${newRoom.number} has been added successfully.`,
      });
    }
  };

  const filteredRooms = rooms.filter(room => {
    if (filters.search && 
      !room.number.toLowerCase().includes(filters.search.toLowerCase()) &&
      !room.type.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status !== "all" && room.status !== filters.status) {
      return false;
    }
    if (filters.type && filters.type !== "all_types" && room.type !== filters.type) {
      return false;
    }
    if (filters.floor && filters.floor !== "all_floors" && room.floor !== filters.floor) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
          <p className="text-muted-foreground">Manage hotel rooms and their status</p>
        </div>
        <Button className="gap-1.5" onClick={handleAddRoom}>
          <Plus size={16} />
          Add Room
        </Button>
      </div>

      <RoomFilterBar onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="text-center py-12 border rounded-lg bg-muted/40">
          <h3 className="text-lg font-medium">Loading rooms...</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/40 md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-medium">No rooms found</h3>
              <p className="text-muted-foreground">Try adjusting your filters</p>
            </div>
          ) : (
            filteredRooms.map(room => (
              <div key={room.id} className="relative">
                <RoomCard 
                  room={room} 
                  onStatusChange={handleStatusChange}
                  onBook={handleBookRoom}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleEditRoom(room)}
                  className="absolute top-2 right-2"
                >
                  <Edit2 size={16} />
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      <RoomDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        room={currentRoom}
        onSave={handleSaveRoom}
      />
    </div>
  );
};

export default Rooms;
