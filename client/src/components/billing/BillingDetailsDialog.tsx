
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Invoice, InvoiceItem } from "@/models/types";
import { format } from "date-fns";

interface BillingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
  formatPrice: (price: number) => string;
}

export function BillingDetailsDialog({ 
  open, 
  onOpenChange, 
  invoice, 
  formatPrice 
}: BillingDetailsDialogProps) {
  
  // Group items by type
  const roomCharges = invoice.items.filter(item => item.type === "room");
  const serviceCharges = invoice.items.filter(item => item.type === "service");
  const otherCharges = invoice.items.filter(item => 
    item.type !== "room" && item.type !== "service"
  );
  
  // Calculate subtotals
  const roomTotal = roomCharges.reduce((sum, item) => sum + item.amount, 0);
  const serviceTotal = serviceCharges.reduce((sum, item) => sum + item.amount, 0);
  const otherTotal = otherCharges.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Invoice Details #{invoice.id}</DialogTitle>
          <DialogDescription>
            Complete billing information for {invoice.guestName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Invoice Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Guest Information</h3>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Guest:</span> {invoice.guestName}</div>
                <div><span className="font-medium">Room:</span> {invoice.roomNumber}</div>
                <div><span className="font-medium">Check-in:</span> {format(new Date(invoice.checkIn), "PPP")}</div>
                <div><span className="font-medium">Check-out:</span> {format(new Date(invoice.checkOut), "PPP")}</div>
                <div><span className="font-medium">Stay Duration:</span> {
                  Math.ceil((new Date(invoice.checkOut).getTime() - new Date(invoice.checkIn).getTime()) / (1000 * 3600 * 24))
                } nights</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Information</h3>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Status:</span> {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</div>
                <div><span className="font-medium">Invoice Date:</span> {format(new Date(invoice.createdAt), "PPP")}</div>
                <div><span className="font-medium">Due Date:</span> {format(new Date(invoice.dueDate), "PPP")}</div>
                {invoice.paidDate && (
                  <div><span className="font-medium">Paid On:</span> {format(new Date(invoice.paidDate), "PPP")}</div>
                )}
                {invoice.paymentMethod && (
                  <div><span className="font-medium">Payment Method:</span> {
                    invoice.paymentMethod.charAt(0).toUpperCase() + invoice.paymentMethod.slice(1)
                  }</div>
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Invoice Items */}
          <div>
            <h3 className="text-sm font-medium mb-2">Invoice Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomCharges.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={5} className="font-medium py-2">
                        Room Charges
                      </TableCell>
                    </TableRow>
                    {roomCharges.map((item, i) => (
                      <TableRow key={`room-${i}`}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.date ? format(new Date(item.date), "dd MMM yyyy") : "-"}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.rate)}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Subtotal:
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(roomTotal)}
                      </TableCell>
                    </TableRow>
                  </>
                )}
                
                {serviceCharges.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={5} className="font-medium py-2">
                        Service Charges
                      </TableCell>
                    </TableRow>
                    {serviceCharges.map((item, i) => (
                      <TableRow key={`service-${i}`}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.date ? format(new Date(item.date), "dd MMM yyyy") : "-"}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.rate)}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
                        Subtotal:
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(serviceTotal)}
                      </TableCell>
                    </TableRow>
                  </>
                )}
                
                {otherCharges.length > 0 && (
                  <>
                    <TableRow>
                      <TableCell colSpan={5} className="font-medium py-2">
                        Other Charges
                      </TableCell>
                    </TableRow>
                    {otherCharges.map((item, i) => (
                      <TableRow key={`other-${i}`}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.date ? format(new Date(item.date), "dd MMM yyyy") : "-"}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.rate)}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.amount)}</TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
                
                <TableRow>
                  <TableCell colSpan={4} className="text-right font-bold text-lg">
                    Total:
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {formatPrice(invoice.amount)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <Separator />
          
          {/* Notes section */}
          {invoice.status === "paid" && (
            <div className="text-center text-sm text-muted-foreground">
              This invoice has been paid in full. Thank you for your business!
            </div>
          )}
          
          {invoice.status === "overdue" && (
            <div className="text-center text-sm text-destructive">
              This invoice is overdue. Please make payment as soon as possible.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-1">
              <Download size={16} />
              Download
            </Button>
            <Button variant="outline" className="gap-1">
              <Printer size={16} />
              Print
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
