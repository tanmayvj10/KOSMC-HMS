
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Mail, CreditCard, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

// Define guest types
interface Guest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: "active" | "past";
  visits: number;
  totalSpent: number;
  idType: string;
  idNumber: string;
}

// Mock data for guests
const mockGuests: Guest[] = [
  {
    id: "g1",
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    roomNumber: "101",
    checkIn: "2023-06-08",
    checkOut: "2023-06-12",
    status: "active",
    visits: 3,
    totalSpent: 14997,
    idType: "Aadhar",
    idNumber: "XXXX-XXXX-1234"
  },
  {
    id: "g2",
    name: "Priya Patel",
    phone: "8765432109",
    email: "priya@example.com",
    roomNumber: "102",
    checkIn: "2023-06-09",
    checkOut: "2023-06-14",
    status: "active",
    visits: 1,
    totalSpent: 7495,
    idType: "PAN",
    idNumber: "ABCDE1234F"
  },
  {
    id: "g3",
    name: "Vikram Singh",
    phone: "7654321098",
    roomNumber: "201",
    checkIn: "2023-06-05",
    checkOut: "2023-06-07",
    status: "past",
    visits: 2,
    totalSpent: 4998,
    idType: "Driving License",
    idNumber: "DL-1234567890"
  },
  {
    id: "g4",
    name: "Anil Kapoor",
    phone: "6543210987",
    email: "anil@example.com",
    roomNumber: "301",
    checkIn: "2023-05-28",
    checkOut: "2023-06-05",
    status: "past",
    visits: 5,
    totalSpent: 35991,
    idType: "Passport",
    idNumber: "J8765432"
  },
  {
    id: "g5",
    name: "Sneha Reddy",
    phone: "5432109876",
    roomNumber: "202",
    checkIn: "2023-06-10",
    checkOut: "2023-06-12",
    status: "active",
    visits: 1,
    totalSpent: 4998,
    idType: "Aadhar",
    idNumber: "XXXX-XXXX-5678"
  }
];

const Guests = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [guests] = useState<Guest[]>(mockGuests);
  const { toast } = useToast();

  const activeGuests = guests.filter(guest => guest.status === "active");
  const pastGuests = guests.filter(guest => guest.status === "past");

  const filteredActiveGuests = activeGuests.filter(
    guest => guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              guest.phone.includes(searchTerm) ||
              guest.roomNumber.includes(searchTerm)
  );

  const filteredPastGuests = pastGuests.filter(
    guest => guest.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              guest.phone.includes(searchTerm) ||
              guest.roomNumber.includes(searchTerm)
  );

  // Format price with rupee symbol
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  // Function to export guests data to Excel
  const handleExportToExcel = (guestList: Guest[], listType: string) => {
    // Prepare the data for Excel export
    const exportData = guestList.map(guest => ({
      'Name': guest.name,
      'Phone': guest.phone,
      'Email': guest.email || 'N/A',
      'Room': guest.roomNumber,
      'Check-in': new Date(guest.checkIn).toLocaleDateString('en-IN'),
      'Check-out': new Date(guest.checkOut).toLocaleDateString('en-IN'),
      'ID Type': guest.idType,
      'ID Number': guest.idNumber,
      'Visits': guest.visits,
      'Total Spent': `₹${guest.totalSpent}`,
    }));
    
    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${listType}_guests_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export successful",
      description: `${guestList.length} ${listType.toLowerCase()} guests exported to Excel.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guests</h1>
          <p className="text-muted-foreground">Manage hotel guests and their information</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, phone, or room number..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">
            Active Guests <Badge variant="secondary" className="ml-2">{activeGuests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Guests <Badge variant="secondary" className="ml-2">{pastGuests.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 mt-4">
          <div className="flex justify-end mb-2">
            <Button 
              variant="outline" 
              onClick={() => handleExportToExcel(filteredActiveGuests, "Active")}
              disabled={filteredActiveGuests.length === 0}
              className="gap-2"
            >
              <Download size={16} />
              Export to Excel
            </Button>
          </div>
          
          {filteredActiveGuests.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/40">
              <h3 className="text-lg font-medium">No active guests found</h3>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            filteredActiveGuests.map(guest => (
              <GuestCard key={guest.id} guest={guest} formatPrice={formatPrice} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4 mt-4">
          <div className="flex justify-end mb-2">
            <Button 
              variant="outline" 
              onClick={() => handleExportToExcel(filteredPastGuests, "Past")}
              disabled={filteredPastGuests.length === 0}
              className="gap-2"
            >
              <Download size={16} />
              Export to Excel
            </Button>
          </div>
          
          {filteredPastGuests.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/40">
              <h3 className="text-lg font-medium">No past guests found</h3>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            filteredPastGuests.map(guest => (
              <GuestCard key={guest.id} guest={guest} formatPrice={formatPrice} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const GuestCard = ({ guest, formatPrice }: { guest: Guest; formatPrice: (price: number) => string }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">{guest.name}</CardTitle>
            <CardDescription>Room {guest.roomNumber}</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone size={14} />
              {guest.phone}
            </div>
            {guest.email && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail size={14} />
                {guest.email}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center text-sm gap-4">
          <div>
            <span className="text-muted-foreground">ID: </span>
            {guest.idType} ({guest.idNumber})
          </div>
          <div>
            <span className="text-muted-foreground">Check-in: </span>
            {new Date(guest.checkIn).toLocaleDateString('en-IN')}
          </div>
          <div>
            <span className="text-muted-foreground">Check-out: </span>
            {new Date(guest.checkOut).toLocaleDateString('en-IN')}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div className="text-sm">
          <span className="text-muted-foreground">Total Visits: </span>
          {guest.visits}
        </div>
        <div className="flex items-center gap-1.5">
          <CreditCard size={16} className="text-muted-foreground" />
          <span className="font-semibold">{formatPrice(guest.totalSpent)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Guests;
