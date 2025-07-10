
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Calendar, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface Activity {
  id: string;
  name: string;
  description: string;
  price: number;
  startTime: string;
  endTime: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "available" | "booked" | "completed" | "cancelled";
}

interface Booking {
  id: string;
  activityId: string;
  activityName: string;
  roomNumber: string;
  guestName: string;
  participants: number;
  totalAmount: number;
  date: string;
  status: "confirmed" | "completed" | "cancelled";
}

export function ServicesActivities() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "act-1",
      name: "Yoga Class",
      description: "Morning yoga session by the pool",
      price: 199,
      startTime: "07:00",
      endTime: "08:00",
      maxParticipants: 15,
      currentParticipants: 8,
      status: "available"
    },
    {
      id: "act-2",
      name: "Spa Treatment",
      description: "Relaxing spa treatment with aromatherapy",
      price: 1299,
      startTime: "10:00",
      endTime: "12:00",
      maxParticipants: 8,
      currentParticipants: 5,
      status: "available"
    },
    {
      id: "act-3",
      name: "Cooking Class",
      description: "Learn to cook authentic local cuisine",
      price: 599,
      startTime: "14:00",
      endTime: "16:00",
      maxParticipants: 12,
      currentParticipants: 10,
      status: "available"
    },
    {
      id: "act-4",
      name: "City Tour",
      description: "Guided tour of the city's main attractions",
      price: 899,
      startTime: "09:00",
      endTime: "13:00",
      maxParticipants: 20,
      currentParticipants: 15,
      status: "available"
    }
  ]);
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "book-1",
      activityId: "act-1",
      activityName: "Yoga Class",
      roomNumber: "101",
      guestName: "Rahul Sharma",
      participants: 2,
      totalAmount: 398,
      date: "2023-07-10",
      status: "confirmed"
    },
    {
      id: "book-2",
      activityId: "act-2",
      activityName: "Spa Treatment",
      roomNumber: "202",
      guestName: "Priya Patel",
      participants: 1,
      totalAmount: 1299,
      date: "2023-07-11",
      status: "completed"
    }
  ]);
  
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const { toast } = useToast();
  
  const handleAddActivity = () => {
    setCurrentActivity(null);
    setActivityDialogOpen(true);
  };
  
  const handleEditActivity = (activity: Activity) => {
    setCurrentActivity(activity);
    setActivityDialogOpen(true);
  };
  
  const handleDeleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
    toast({
      title: "Activity deleted",
      description: "The activity has been deleted successfully",
    });
  };
  
  const handleSaveActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const activityData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      maxParticipants: parseInt(formData.get("maxParticipants") as string),
      currentParticipants: currentActivity ? currentActivity.currentParticipants : 0,
      status: formData.get("status") as "available" | "booked" | "completed" | "cancelled",
    };
    
    if (currentActivity) {
      // Edit existing activity
      setActivities(prev => 
        prev.map(activity => 
          activity.id === currentActivity.id 
            ? { ...activity, ...activityData } 
            : activity
        )
      );
      toast({
        title: "Activity updated",
        description: `${activityData.name} has been updated successfully`,
      });
    } else {
      // Add new activity
      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        ...activityData
      };
      setActivities(prev => [...prev, newActivity]);
      toast({
        title: "Activity added",
        description: `${activityData.name} has been added successfully`,
      });
    }
    
    setActivityDialogOpen(false);
  };
  
  const handleBookActivity = (activity: Activity) => {
    if (activity.currentParticipants >= activity.maxParticipants) {
      toast({
        title: "Activity fully booked",
        description: "This activity has reached its maximum capacity",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedActivity(activity);
    setBookingDialogOpen(true);
  };
  
  const handleSaveBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedActivity) return;
    
    const formData = new FormData(e.currentTarget);
    const roomNumber = formData.get("roomNumber") as string;
    const guestName = formData.get("guestName") as string;
    const participants = parseInt(formData.get("participants") as string);
    const date = formData.get("date") as string;
    
    if (selectedActivity.currentParticipants + participants > selectedActivity.maxParticipants) {
      toast({
        title: "Too many participants",
        description: `Only ${selectedActivity.maxParticipants - selectedActivity.currentParticipants} spots left for this activity`,
        variant: "destructive"
      });
      return;
    }
    
    // Create new booking
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      activityId: selectedActivity.id,
      activityName: selectedActivity.name,
      roomNumber,
      guestName,
      participants,
      totalAmount: selectedActivity.price * participants,
      date,
      status: "confirmed"
    };
    
    setBookings(prev => [...prev, newBooking]);
    
    // Update activity participants count
    setActivities(prev => 
      prev.map(activity => 
        activity.id === selectedActivity.id 
          ? { 
              ...activity, 
              currentParticipants: activity.currentParticipants + participants,
              status: activity.currentParticipants + participants >= activity.maxParticipants ? "booked" : "available"
            } 
          : activity
      )
    );
    
    toast({
      title: "Booking confirmed",
      description: `${selectedActivity.name} has been booked successfully`,
    });
    
    setBookingDialogOpen(false);
  };
  
  const handleCancelBooking = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;
    
    // Update booking status
    setBookings(prev => 
      prev.map(b => 
        b.id === id 
          ? { ...b, status: "cancelled" } 
          : b
      )
    );
    
    // Update activity participants count
    setActivities(prev => 
      prev.map(activity => 
        activity.id === booking.activityId 
          ? { 
              ...activity, 
              currentParticipants: Math.max(0, activity.currentParticipants - booking.participants),
              status: "available"
            } 
          : activity
      )
    );
    
    toast({
      title: "Booking cancelled",
      description: `The booking for ${booking.activityName} has been cancelled`,
    });
  };
  
  const handleCompleteBooking = (id: string) => {
    setBookings(prev => 
      prev.map(b => 
        b.id === id 
          ? { ...b, status: "completed" } 
          : b
      )
    );
    
    toast({
      title: "Booking completed",
      description: "The booking has been marked as completed",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Activities</h2>
        <Button onClick={handleAddActivity} className="gap-1">
          <Plus size={16} />
          Add Activity
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map(activity => (
          <Card key={activity.id} className={activity.status === "booked" ? "opacity-70" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{activity.name}</CardTitle>
                <div className="space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEditActivity(activity)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteActivity(activity.id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <div className="flex justify-between mt-2">
                <p className="text-lg font-medium">₹{activity.price}</p>
                <Badge variant={activity.status === "available" ? "outline" : "secondary"}>
                  {activity.status === "available" 
                    ? `${activity.currentParticipants}/${activity.maxParticipants} booked` 
                    : "Fully Booked"}
                </Badge>
              </div>
              <div className="text-sm mt-2">
                <p>Time: {activity.startTime} - {activity.endTime}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full gap-1.5" 
                disabled={activity.status !== "available"}
                onClick={() => handleBookActivity(activity)}
              >
                <Calendar size={16} />
                Book Activity
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Activity Bookings</h2>
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No bookings found.</p>
            </div>
          ) : (
            bookings.map(booking => (
              <Card key={booking.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg">{booking.activityName}</CardTitle>
                      <div className="text-sm">
                        Room {booking.roomNumber} - {booking.guestName}
                      </div>
                    </div>
                    <Badge className={
                      booking.status === "completed" ? "bg-green-100 text-green-800" :
                      booking.status === "cancelled" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p>{booking.date}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Participants</p>
                      <p>{booking.participants}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-medium">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {booking.status === "confirmed" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleCompleteBooking(booking.id)}
                      >
                        Mark Completed
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Activity Dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentActivity ? "Edit Activity" : "Add New Activity"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveActivity}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Activity Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={currentActivity?.name || ""} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={currentActivity?.description || ""} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  defaultValue={currentActivity?.price || ""} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    name="startTime" 
                    type="time" 
                    defaultValue={currentActivity?.startTime || ""} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input 
                    id="endTime" 
                    name="endTime" 
                    type="time" 
                    defaultValue={currentActivity?.endTime || ""} 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input 
                  id="maxParticipants" 
                  name="maxParticipants" 
                  type="number" 
                  min="1" 
                  defaultValue={currentActivity?.maxParticipants || ""} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={currentActivity?.status || "available"}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="booked">Fully Booked</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{currentActivity ? "Update" : "Add"} Activity</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Book {selectedActivity?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveBooking}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input id="roomNumber" name="roomNumber" required />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="guestName">Guest Name</Label>
                  <Input id="guestName" name="guestName" required />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="participants">Number of Participants</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="participants" 
                    name="participants" 
                    type="number" 
                    min="1" 
                    max={selectedActivity?.maxParticipants - (selectedActivity?.currentParticipants || 0)} 
                    defaultValue="1" 
                    required 
                  />
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    <Users size={16} className="inline mr-1" />
                    {selectedActivity && (
                      <span>{selectedActivity.currentParticipants}/{selectedActivity.maxParticipants} booked</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-2 p-3 bg-muted rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Activity price:</span>
                  <span>₹{selectedActivity?.price} per person</span>
                </div>
                <div className="flex justify-between font-medium mt-2">
                  <span>Total amount:</span>
                  <span>₹{(selectedActivity?.price || 0) * 1}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Confirm Booking</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
