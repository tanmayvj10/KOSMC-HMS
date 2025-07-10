import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, FileText, CreditCard, QrCode, Download, Printer, Plus, Eye, Calendar as CalendarIcon, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice, InvoiceItem } from "@/models/types";
import { BillingDetailsDialog } from "@/components/billing/BillingDetailsDialog";
import { Calendar } from "@/components/ui/calendar";

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    guestName: "Rahul Sharma",
    guestId: "guest-001",
    roomNumber: "101",
    reservationId: "RES-001",
    checkIn: "2023-06-08",
    checkOut: "2023-06-12",
    amount: 7346,
    status: "paid",
    createdAt: "2023-06-12",
    dueDate: "2023-06-12",
    paidDate: "2023-06-12",
    paymentMethod: "card",
    items: [
      { description: "Room Charges (4 nights)", quantity: 4, rate: 1499, amount: 5996, type: "room", date: "2023-06-08" },
      { description: "Room Service - Breakfast", quantity: 2, rate: 350, amount: 700, type: "service", serviceId: "SRV-001", date: "2023-06-09" },
      { description: "Restaurant - Dinner", quantity: 1, rate: 650, amount: 650, type: "service", serviceId: "SRV-002", date: "2023-06-10" }
    ]
  },
  {
    id: "INV-002",
    guestName: "Priya Patel",
    guestId: "guest-002",
    roomNumber: "102",
    reservationId: "RES-002",
    checkIn: "2023-06-09",
    checkOut: "2023-06-14",
    amount: 8995,
    status: "pending",
    createdAt: "2023-06-09",
    dueDate: "2023-06-14",
    items: [
      { description: "Room Charges (5 nights)", quantity: 5, rate: 1499, amount: 7495, type: "room", date: "2023-06-09" },
      { description: "Spa Service", quantity: 1, rate: 1500, amount: 1500, type: "service", serviceId: "SRV-003", date: "2023-06-11" }
    ]
  },
  {
    id: "INV-003",
    guestName: "Vikram Singh",
    guestId: "guest-003",
    roomNumber: "201",
    reservationId: "RES-003",
    checkIn: "2023-06-05",
    checkOut: "2023-06-07",
    amount: 5498,
    status: "paid",
    createdAt: "2023-06-07",
    dueDate: "2023-06-07",
    paidDate: "2023-06-07",
    paymentMethod: "cash",
    items: [
      { description: "Room Charges (2 nights)", quantity: 2, rate: 2499, amount: 4998, type: "room", date: "2023-06-05" },
      { description: "Laundry Service", quantity: 1, rate: 500, amount: 500, type: "service", serviceId: "SRV-004", date: "2023-06-06" }
    ]
  },
  {
    id: "INV-004",
    guestName: "Sneha Reddy",
    guestId: "guest-004",
    roomNumber: "202",
    reservationId: "RES-004",
    checkIn: "2023-06-10",
    checkOut: "2023-06-12",
    amount: 6498,
    status: "overdue",
    createdAt: "2023-06-10",
    dueDate: "2023-06-13",
    items: [
      { description: "Room Charges (2 nights)", quantity: 2, rate: 2499, amount: 4998, type: "room", date: "2023-06-10" },
      { description: "Airport Transfer", quantity: 1, rate: 1000, amount: 1000, type: "service", serviceId: "SRV-005", date: "2023-06-10" },
      { description: "Restaurant - Lunch", quantity: 2, rate: 250, amount: 500, type: "service", serviceId: "SRV-006", date: "2023-06-11" }
    ]
  }
];

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const applyFilters = () => {
    return invoices.filter(invoice => {
      const searchMatches = searchTerm ? (
        invoice.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.roomNumber.includes(searchTerm) ||
        invoice.amount.toString().includes(searchTerm) ||
        invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.items.some(item => 
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) : true;

      const dateMatches = dateFilter ? (
        new Date(invoice.createdAt).toDateString() === dateFilter.toDateString() ||
        new Date(invoice.dueDate).toDateString() === dateFilter.toDateString() ||
        (invoice.paidDate && new Date(invoice.paidDate).toDateString() === dateFilter.toDateString())
      ) : true;

      const statusMatches = statusFilter !== "all" ? 
        invoice.status === statusFilter : true;

      return searchMatches && dateMatches && statusMatches;
    });
  };

  const filteredInvoices = applyFilters();
  const paidInvoices = filteredInvoices.filter(invoice => invoice.status === "paid");
  const pendingInvoices = filteredInvoices.filter(invoice => 
    invoice.status === "pending" || invoice.status === "overdue"
  );

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailsDialogOpen(true);
  };

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const handleShowQR = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setQrDialogOpen(true);
  };

  const handlePaymentComplete = () => {
    if (selectedInvoice) {
      const updatedInvoices = invoices.map(inv => 
        inv.id === selectedInvoice.id 
          ? {
              ...inv, 
              status: "paid" as const,
              paidDate: new Date().toISOString().split('T')[0],
              paymentMethod: "card" as const
            } 
          : inv
      );
      
      setInvoices(updatedInvoices);
      setPaymentDialogOpen(false);
      
      toast({
        title: "Payment successful",
        description: `Payment of ₹${selectedInvoice.amount.toLocaleString('en-IN')} processed successfully.`,
      });
    }
  };

  const handleCreateInvoice = () => {
    toast({
      title: "Create Invoice",
      description: "This feature is coming soon!",
    });
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDateFilter(undefined);
    setStatusFilter("all");
  };

  const getTotalRevenue = () => {
    return paidInvoices.reduce((total, invoice) => total + invoice.amount, 0);
  };

  const getPendingRevenue = () => {
    return pendingInvoices.reduce((total, invoice) => total + invoice.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground">Manage invoices and payments</p>
        </div>
        <Button className="gap-1.5" onClick={handleCreateInvoice}>
          <Plus size={16} />
          New Invoice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">
              {paidInvoices.length} paid, {pendingInvoices.length} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(getTotalRevenue())}</div>
            <p className="text-xs text-muted-foreground">
              From {paidInvoices.length} paid invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(getPendingRevenue())}</div>
            <p className="text-xs text-muted-foreground">
              From {pendingInvoices.length} pending invoices
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices by any field..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            <CalendarIcon size={16} />
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={dateFilter ? "w-[240px] font-normal" : "w-[240px] text-muted-foreground font-normal"}>
                {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(searchTerm || dateFilter || statusFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending <Badge variant="secondary" className="ml-2">{pendingInvoices.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid <Badge variant="secondary" className="ml-2">{paidInvoices.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingInvoices.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/40">
              <h3 className="text-lg font-medium">No pending invoices found</h3>
              <p className="text-muted-foreground">All invoices have been paid</p>
            </div>
          ) : (
            pendingInvoices.map(invoice => (
              <InvoiceCard 
                key={invoice.id} 
                invoice={invoice} 
                formatPrice={formatPrice} 
                getStatusColor={getStatusColor} 
                onPay={handlePayInvoice}
                onShowQR={handleShowQR}
                onView={handleViewDetails}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="paid" className="space-y-4 mt-4">
          {paidInvoices.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/40">
              <h3 className="text-lg font-medium">No paid invoices found</h3>
              <p className="text-muted-foreground">None of your invoices are paid yet</p>
            </div>
          ) : (
            paidInvoices.map(invoice => (
              <InvoiceCard 
                key={invoice.id} 
                invoice={invoice} 
                formatPrice={formatPrice} 
                getStatusColor={getStatusColor} 
                isPaid={true}
                onView={handleViewDetails}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-lg font-medium">Invoice #{selectedInvoice?.id}</div>
              <div className="text-muted-foreground">{selectedInvoice?.guestName}</div>
              <div className="text-2xl font-bold mt-4">{selectedInvoice && formatPrice(selectedInvoice.amount)}</div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-2">
                <Input type="text" placeholder="Card number" className="col-span-3" />
                <Input type="text" placeholder="MM/YY" />
                <Input type="text" placeholder="CVV" />
                <Input type="text" placeholder="ZIP" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handlePaymentComplete} className="gap-2">
              <CreditCard size={16} />
              Process Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Scan to Pay</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-lg font-medium">Invoice #{selectedInvoice?.id}</div>
              <div className="text-muted-foreground">{selectedInvoice?.guestName}</div>
              <div className="text-2xl font-bold mt-2 mb-4">{selectedInvoice && formatPrice(selectedInvoice.amount)}</div>
              
              <div className="mx-auto w-48 h-48 bg-gray-100 flex items-center justify-center border">
                <QrCode size={120} />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Scan this QR code using any UPI app to make payment
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedInvoice && (
        <BillingDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          invoice={selectedInvoice}
          formatPrice={formatPrice}
        />
      )}
    </div>
  );
};

interface InvoiceCardProps {
  invoice: Invoice;
  formatPrice: (price: number) => string;
  getStatusColor: (status: string) => string;
  onPay?: (invoice: Invoice) => void;
  onShowQR?: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
  isPaid?: boolean;
}

const InvoiceCard = ({ 
  invoice, formatPrice, getStatusColor, onPay, onShowQR, onView, isPaid = false 
}: InvoiceCardProps) => {
  const serviceCharges = invoice.items
    .filter(item => item.type === "service")
    .reduce((total, item) => total + item.amount, 0);

  const roomCharges = invoice.items
    .filter(item => item.type === "room")
    .reduce((total, item) => total + item.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg">Invoice #{invoice.id}</CardTitle>
            <CardDescription>{invoice.guestName} - Room {invoice.roomNumber}</CardDescription>
          </div>
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between text-sm">
          <div className="space-y-1">
            <div>
              <span className="text-muted-foreground">Created: </span>
              {new Date(invoice.createdAt).toLocaleDateString('en-IN')}
            </div>
            <div>
              <span className="text-muted-foreground">Due Date: </span>
              {new Date(invoice.dueDate).toLocaleDateString('en-IN')}
            </div>
            {invoice.paidDate && (
              <div>
                <span className="text-muted-foreground">Paid Date: </span>
                {new Date(invoice.paidDate).toLocaleDateString('en-IN')}
              </div>
            )}
          </div>
          <div className="space-y-1 mt-2 sm:mt-0 sm:text-right">
            <div>
              <span className="text-muted-foreground">Check-in: </span>
              {new Date(invoice.checkIn).toLocaleDateString('en-IN')}
            </div>
            <div>
              <span className="text-muted-foreground">Check-out: </span>
              {new Date(invoice.checkOut).toLocaleDateString('en-IN')}
            </div>
            <div>
              <span className="text-muted-foreground">Services: </span>
              {formatPrice(serviceCharges)}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 border-t">
        <div>
          <div className="font-semibold">{formatPrice(invoice.amount)}</div>
          <div className="text-xs text-muted-foreground">
            Room: {formatPrice(roomCharges)} + Services: {formatPrice(serviceCharges)}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => onView(invoice)}>
            <Eye size={14} />
            View
          </Button>
          
          {isPaid ? (
            <>
              <Button size="sm" variant="outline" className="gap-1">
                <Download size={14} />
                Download
              </Button>
              <Button size="sm" variant="outline" className="gap-1">
                <Printer size={14} />
                Print
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => onShowQR?.(invoice)}>
                <QrCode size={14} />
                UPI QR
              </Button>
              <Button size="sm" className="gap-1" onClick={() => onPay?.(invoice)}>
                <CreditCard size={14} />
                Pay Now
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Billing;
