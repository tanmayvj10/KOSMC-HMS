
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { RoomStatus } from "./RoomCard";

interface RoomFilterBarProps {
  onFilterChange: (filters: RoomFilters) => void;
}

export interface RoomFilters {
  search: string;
  status: RoomStatus | "all";
  type: string;
  floor: string;
}

export function RoomFilterBar({ onFilterChange }: RoomFilterBarProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RoomStatus | "all">("all");
  const [type, setType] = useState("");
  const [floor, setFloor] = useState("");

  // Room types and floors for our filters
  const roomTypes = ["Standard", "Deluxe", "Suite", "Executive"];
  const floorOptions = ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"];

  useEffect(() => {
    onFilterChange({ search, status, type, floor });
  }, [search, status, type, floor, onFilterChange]);

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setType("");
    setFloor("");
  };

  return (
    <div className="bg-card p-4 rounded-lg border mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="search" className="mb-1.5 block">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search room..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status" className="mb-1.5 block">Status</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as RoomStatus | "all")}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type" className="mb-1.5 block">Room Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_types">All types</SelectItem>
              {roomTypes.map((roomType) => (
                <SelectItem key={roomType} value={roomType}>
                  {roomType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="floor" className="mb-1.5 block">Floor</Label>
          <Select value={floor} onValueChange={setFloor}>
            <SelectTrigger id="floor">
              <SelectValue placeholder="All floors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_floors">All floors</SelectItem>
              {floorOptions.map((f) => (
                <SelectItem key={f} value={f}>
                  Floor {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(search || status !== "all" || type || floor) && (
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="gap-1.5"
          >
            <X size={16} />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
