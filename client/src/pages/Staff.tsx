
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StaffCard } from "@/components/staff/StaffCard";
import { StaffDialog } from "@/components/staff/StaffDialog";
import { Button } from "@/components/ui/button";
import { Plus, UserPlus, Search, X, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StaffMember } from "@/models/types";

// Mock data for staff members with hierarchical structure
const initialStaffData: StaffMember[] = [
  // Management
  {
    id: "staff-1",
    name: "Arjun Sharma",
    position: "General Manager",
    department: "management",
    phone: "9876543210",
    email: "arjun.sharma@hotelkeeper.com",
    joiningDate: "2021-03-15",
    status: "active",
  },
  {
    id: "staff-2",
    name: "Priya Patel",
    position: "Assistant Manager",
    department: "management",
    reportTo: "staff-1",
    phone: "9876543211",
    email: "priya.patel@hotelkeeper.com",
    joiningDate: "2021-06-10",
    status: "active",
  },
  
  // Reception
  {
    id: "staff-3",
    name: "Deepak Kumar",
    position: "Front Office Manager",
    department: "reception",
    reportTo: "staff-2",
    phone: "9876543212",
    email: "deepak.kumar@hotelkeeper.com",
    joiningDate: "2021-08-22",
    status: "active",
  },
  {
    id: "staff-4",
    name: "Ananya Singh",
    position: "Receptionist",
    department: "reception",
    reportTo: "staff-3",
    phone: "9876543213",
    email: "ananya.singh@hotelkeeper.com",
    joiningDate: "2022-01-15",
    status: "active",
  },
  {
    id: "staff-5",
    name: "Rohit Verma",
    position: "Receptionist",
    department: "reception",
    reportTo: "staff-3",
    phone: "9876543214",
    email: "rohit.verma@hotelkeeper.com",
    joiningDate: "2022-03-05",
    status: "on-leave",
  },
  
  // Housekeeping
  {
    id: "staff-6",
    name: "Sanjay Gupta",
    position: "Housekeeping Manager",
    department: "housekeeping",
    reportTo: "staff-2",
    phone: "9876543215",
    email: "sanjay.gupta@hotelkeeper.com",
    joiningDate: "2021-09-12",
    status: "active",
  },
  {
    id: "staff-7",
    name: "Meera Reddy",
    position: "Room Attendant",
    department: "housekeeping",
    reportTo: "staff-6",
    phone: "9876543216",
    joiningDate: "2022-04-10",
    status: "active",
  },
  {
    id: "staff-8",
    name: "Rajesh Kumar",
    position: "Room Attendant",
    department: "housekeeping",
    reportTo: "staff-6",
    phone: "9876543217",
    joiningDate: "2022-05-20",
    status: "active",
  },
  
  // Restaurant
  {
    id: "staff-9",
    name: "Vikram Malhotra",
    position: "Restaurant Manager",
    department: "restaurant",
    reportTo: "staff-2",
    phone: "9876543218",
    email: "vikram.malhotra@hotelkeeper.com",
    joiningDate: "2021-10-05",
    status: "active",
  },
  {
    id: "staff-10",
    name: "Neha Kapoor",
    position: "Chef",
    department: "restaurant",
    reportTo: "staff-9",
    phone: "9876543219",
    email: "neha.kapoor@hotelkeeper.com",
    joiningDate: "2022-02-14",
    status: "active",
  },
  {
    id: "staff-11",
    name: "Amit Saxena",
    position: "Waiter",
    department: "restaurant",
    reportTo: "staff-9",
    phone: "9876543220",
    joiningDate: "2022-06-01",
    status: "active",
  },
  
  // Security
  {
    id: "staff-12",
    name: "Suresh Yadav",
    position: "Security Head",
    department: "security",
    reportTo: "staff-2",
    phone: "9876543221",
    joiningDate: "2021-11-15",
    status: "active",
  },
  {
    id: "staff-13",
    name: "Rakesh Mishra",
    position: "Security Guard",
    department: "security",
    reportTo: "staff-12",
    phone: "9876543222",
    joiningDate: "2022-07-10",
    status: "active",
  }
];

const Staff = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffMember | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    // In a real app, this would be an API call
    setStaff(initialStaffData);
  }, []);

  const handleAddStaff = () => {
    setCurrentStaff(undefined);
    setDialogOpen(true);
  };

  const handleEditStaff = (staffMember: StaffMember) => {
    setCurrentStaff(staffMember);
    setDialogOpen(true);
  };

  const handleDeleteStaff = (staffMember: StaffMember) => {
    setStaffToDelete(staffMember);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStaff = () => {
    if (staffToDelete) {
      // Check if this staff is a manager to anyone else
      const hasDirectReports = staff.some(member => member.reportTo === staffToDelete.id);
      
      if (hasDirectReports) {
        toast({
          title: "Cannot delete staff",
          description: "This staff member is a manager to other staff. Please reassign their reports first.",
          variant: "destructive",
        });
        setDeleteDialogOpen(false);
        return;
      }
      
      setStaff(prevStaff => prevStaff.filter(member => member.id !== staffToDelete.id));
      toast({
        title: "Staff deleted",
        description: `${staffToDelete.name} has been removed from staff.`,
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleSaveStaff = (staffData: Partial<StaffMember>) => {
    if (currentStaff) {
      // Edit existing staff
      setStaff(prevStaff =>
        prevStaff.map(member =>
          member.id === currentStaff.id ? { ...member, ...staffData } as StaffMember : member
        )
      );
      toast({
        title: "Staff updated",
        description: `${staffData.name}'s information has been updated successfully.`,
      });
    } else {
      // Add new staff
      const newStaff: StaffMember = {
        id: `staff-${Date.now()}`,
        name: staffData.name || "",
        position: staffData.position || "",
        department: staffData.department || "reception",
        reportTo: staffData.reportTo,
        phone: staffData.phone || "",
        email: staffData.email,
        joiningDate: staffData.joiningDate || new Date().toISOString().split('T')[0],
        status: staffData.status || "active",
        image: staffData.image,
      };
      
      setStaff(prevStaff => [...prevStaff, newStaff]);
      toast({
        title: "Staff added",
        description: `${newStaff.name} has been added to the staff.`,
      });
    }
  };

  // Search and filter staff members
  const filteredStaff = staff.filter(member => {
    // Department filter
    if (activeTab !== "all" && member.department !== activeTab) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== "all" && member.status !== statusFilter) {
      return false;
    }
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        member.name.toLowerCase().includes(searchLower) ||
        member.position.toLowerCase().includes(searchLower) ||
        member.phone.includes(searchTerm) ||
        (member.email && member.email.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Group staff by hierarchical structure
  const buildHierarchy = (members: StaffMember[], parentId?: string): StaffMember[][] => {
    const result: StaffMember[][] = [];
    
    // Find root level staff (no reportTo or reportTo matches parentId)
    const rootStaff = members.filter(m => 
      parentId ? m.reportTo === parentId : !m.reportTo
    );
    
    if (rootStaff.length) {
      result.push(rootStaff);
      
      // For each root staff, find their direct reports
      rootStaff.forEach(root => {
        const childHierarchy = buildHierarchy(members, root.id);
        result.push(...childHierarchy);
      });
    }
    
    return result;
  };
  
  const staffHierarchy = buildHierarchy(filteredStaff);

  // Check if user is allowed to manage staff
  const userRole = localStorage.getItem("userRole") || "admin";
  const canManageStaff = userRole === "admin";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">View and manage hotel staff members</p>
        </div>
        {canManageStaff && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="gap-1.5" 
              onClick={handleAddStaff}
            >
              <UserPlus size={16} />
              Add Staff
            </Button>
            <Button className="gap-1.5" onClick={handleAddStaff}>
              <Plus size={16} />
              New Staff
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search staff by name, position, or contact..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchTerm("")}
            >
              <X size={14} />
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-leave">On Leave</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Staff</TabsTrigger>
          <TabsTrigger value="management">Management</TabsTrigger>
          <TabsTrigger value="reception">Reception</TabsTrigger>
          <TabsTrigger value="housekeeping">Housekeeping</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {staffHierarchy.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/40">
              <h3 className="text-lg font-medium">No staff members found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || activeTab !== "all" 
                  ? "Try adjusting your filters to see more results" 
                  : "Add new staff to see them here"}
              </p>
              {(searchTerm || statusFilter !== "all" || activeTab !== "all") && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setActiveTab("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            staffHierarchy.map((level, index) => (
              <div key={index} className="staff-level">
                <div className="flex flex-wrap gap-4 mb-8">
                  {level.map(member => (
                    <StaffCard 
                      key={member.id} 
                      staff={member} 
                      onEdit={() => handleEditStaff(member)}
                      onDelete={canManageStaff ? () => handleDeleteStaff(member) : undefined}
                      allStaff={staff}
                    />
                  ))}
                </div>
                {index < staffHierarchy.length - 1 && (
                  <div className="w-0 mx-auto border-l-2 border-dashed border-gray-200 h-8"></div>
                )}
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <StaffDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        staff={currentStaff}
        onSave={handleSaveStaff}
        allStaff={staff}
      />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {staffToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteStaff}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;
