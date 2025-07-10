
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { StaffMember } from "@/models/types"; // Change import from @/models/types
import { cn } from "@/lib/utils";

interface StaffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff?: StaffMember;
  onSave: (staff: Partial<StaffMember>) => void;
  allStaff: StaffMember[];
}

export function StaffDialog({ open, onOpenChange, staff, onSave, allStaff }: StaffDialogProps) {
  const today = new Date();
  const [joiningDate, setJoiningDate] = React.useState<Date | undefined>(
    staff?.joiningDate ? new Date(staff.joiningDate) : today
  );
  
  const [formState, setFormState] = React.useState<Partial<StaffMember>>(
    staff ?? {
      name: "",
      position: "",
      department: "reception",
      phone: "",
      email: "",
      joiningDate: format(today, 'yyyy-MM-dd'),
      status: "active"
    }
  );

  // Reset form state when dialog opens/closes or staff changes
  React.useEffect(() => {
    if (open) {
      setFormState(
        staff ?? {
          name: "",
          position: "",
          department: "reception",
          phone: "",
          email: "",
          joiningDate: format(today, 'yyyy-MM-dd'),
          status: "active"
        }
      );
      setJoiningDate(staff?.joiningDate ? new Date(staff.joiningDate) : today);
    }
  }, [open, staff, today]);

  const { toast } = useToast();

  const handleChange = (field: keyof StaffMember, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setJoiningDate(date);
      handleChange("joiningDate", format(date, 'yyyy-MM-dd'));
    }
  };

  const validateStaffData = (): boolean => {
    if (!formState.name?.trim()) {
      toast({
        title: "Error",
        description: "Staff name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formState.position?.trim()) {
      toast({
        title: "Error",
        description: "Position is required",
        variant: "destructive",
      });
      return false;
    }

    if (!formState.phone?.trim()) {
      toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return false;
    }

    // Check for duplicates (phone numbers should be unique)
    const isDuplicate = allStaff.some(existingStaff => 
      existingStaff.phone === formState.phone && existingStaff.id !== staff?.id
    );

    if (isDuplicate) {
      toast({
        title: "Error",
        description: "This phone number is already registered with another staff member",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStaffData()) {
      return;
    }

    onSave(formState);
    onOpenChange(false);
  };

  // Get possible managers based on department
  const getPotentialManagers = () => {
    // Filter out the current staff member
    const filteredStaff = staff 
      ? allStaff.filter(member => member.id !== staff.id)
      : allStaff;
      
    return filteredStaff.filter(member => 
      // Management can report to management
      (formState.department === "management" && member.department === "management") ||
      // Others report to their department head or management
      (formState.department !== "management" && 
        (member.department === formState.department || member.department === "management"))
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{staff?.id ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
            <DialogDescription>
              {staff?.id ? "Update staff details below." : "Fill in the details for the new staff member."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formState.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                placeholder="Full name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                value={formState.position || ""}
                onChange={(e) => handleChange("position", e.target.value)}
                className="col-span-3"
                placeholder="Job title"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Select 
                value={formState.department} 
                onValueChange={(value) => handleChange("department", value as any)}
              >
                <SelectTrigger id="department" className="col-span-3">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="reception">Reception</SelectItem>
                  <SelectItem value="housekeeping">Housekeeping</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-to" className="text-right">
                Reports To
              </Label>
              <Select 
                value={formState.reportTo || ""} 
                onValueChange={(value) => handleChange("reportTo", value)}
              >
                <SelectTrigger id="report-to" className="col-span-3">
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {getPotentialManagers().map(manager => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.name} ({manager.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                placeholder="Email address (optional)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Joining Date</Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {joiningDate ? format(joiningDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={joiningDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                value={formState.status} 
                onValueChange={(value) => handleChange("status", value as any)}
              >
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">{staff?.id ? "Save Changes" : "Add Staff Member"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
