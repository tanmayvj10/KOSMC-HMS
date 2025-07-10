
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface RoomServiceItem {
  id: string;
  name: string;
  category: "Food" | "Beverages" | "Amenities" | "Laundry" | "Other";
  price: number;
  description: string;
  status: "available" | "unavailable";
}

interface RoomServiceOrder {
  id: string;
  roomNumber: string;
  guestName: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: "pending" | "delivered" | "cancelled";
  date: string;
  specialInstructions?: string;
}

export function ServicesRoomService() {
  const [items, setItems] = useState<RoomServiceItem[]>([
    {
      id: "rs-1",
      name: "Club Sandwich",
      category: "Food",
      price: 299,
      description: "Chicken club sandwich with fries",
      status: "available"
    },
    {
      id: "rs-2",
      name: "Fresh Fruit Platter",
      category: "Food",
      price: 249,
      description: "Seasonal fruit platter",
      status: "available"
    },
    {
      id: "rs-3",
      name: "Extra Towels",
      category: "Amenities",
      price: 0,
      description: "Additional towels for the room",
      status: "available"
    },
    {
      id: "rs-4",
      name: "Wine Bottle",
      category: "Beverages",
      price: 1299,
      description: "Premium red wine",
      status: "available"
    },
    {
      id: "rs-5",
      name: "Shirt Ironing",
      category: "Laundry",
      price: 99,
      description: "Ironing service for one shirt",
      status: "available"
    }
  ]);
  
  const [orders, setOrders] = useState<RoomServiceOrder[]>([
    {
      id: "order-1",
      roomNumber: "101",
      guestName: "Rahul Sharma",
      items: [
        { id: "rs-1", name: "Club Sandwich", price: 299, quantity: 2 },
        { id: "rs-4", name: "Wine Bottle", price: 1299, quantity: 1 }
      ],
      totalAmount: 1897,
      status: "delivered",
      date: "2023-07-10T18:30:00"
    },
    {
      id: "order-2",
      roomNumber: "202",
      guestName: "Priya Patel",
      items: [
        { id: "rs-2", name: "Fresh Fruit Platter", price: 249, quantity: 1 },
        { id: "rs-3", name: "Extra Towels", price: 0, quantity: 2 }
      ],
      totalAmount: 249,
      status: "pending",
      date: "2023-07-11T09:15:00",
      specialInstructions: "Please leave outside the door"
    }
  ]);
  
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<RoomServiceItem | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const handleAddItem = () => {
    setCurrentItem(null);
    setItemDialogOpen(true);
  };
  
  const handleEditItem = (item: RoomServiceItem) => {
    setCurrentItem(item);
    setItemDialogOpen(true);
  };
  
  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item deleted",
      description: "The item has been deleted successfully",
    });
  };
  
  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData = {
      name: formData.get("name") as string,
      category: formData.get("category") as "Food" | "Beverages" | "Amenities" | "Laundry" | "Other",
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      status: formData.get("status") as "available" | "unavailable",
    };
    
    if (currentItem) {
      // Edit existing item
      setItems(prev => 
        prev.map(item => 
          item.id === currentItem.id 
            ? { ...item, ...itemData } 
            : item
        )
      );
      toast({
        title: "Item updated",
        description: `${itemData.name} has been updated successfully`,
      });
    } else {
      // Add new item
      const newItem: RoomServiceItem = {
        id: `rs-${Date.now()}`,
        ...itemData
      };
      setItems(prev => [...prev, newItem]);
      toast({
        title: "Item added",
        description: `${itemData.name} has been added successfully`,
      });
    }
    
    setItemDialogOpen(false);
  };
  
  const handleCreateOrder = () => {
    setSelectedItems([]);
    setOrderDialogOpen(true);
  };
  
  const handleAddToOrder = (item: RoomServiceItem) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      } else {
        return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
      }
    });
  };
  
  const handleRemoveFromOrder = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromOrder(id);
      return;
    }
    
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const handleSaveOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add at least one item to the order",
        variant: "destructive"
      });
      return;
    }
    
    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: RoomServiceOrder = {
      id: `order-${Date.now()}`,
      roomNumber: formData.get("roomNumber") as string,
      guestName: formData.get("guestName") as string,
      items: selectedItems,
      totalAmount,
      status: "pending",
      date: new Date().toISOString(),
      specialInstructions: formData.get("specialInstructions") as string
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    toast({
      title: "Order created",
      description: `Order for Room ${newOrder.roomNumber} has been created successfully`,
    });
    
    setOrderDialogOpen(false);
  };
  
  const handleUpdateOrderStatus = (id: string, status: "pending" | "delivered" | "cancelled") => {
    setOrders(prev => 
      prev.map(order => 
        order.id === id 
          ? { ...order, status } 
          : order
      )
    );
    
    toast({
      title: "Order status updated",
      description: `Order status has been updated to ${status}`,
    });
  };
  
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Room Service Menu</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddItem} className="gap-1">
            <Plus size={16} />
            Add Item
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length === 0 ? (
            <div className="text-center p-8 border rounded-lg col-span-full">
              <p className="text-muted-foreground">No items found matching your search.</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <Card key={item.id} className={item.status === "unavailable" ? "opacity-70" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">{item.category}</Badge>
                    </div>
                    <div className="space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-lg font-medium mt-2">₹{item.price}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={item.status === "unavailable"}
                    onClick={() => handleAddToOrder(item)}
                  >
                    Add to Order
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Current Orders</h2>
          <Button onClick={handleCreateOrder} className="gap-1">
            <Plus size={16} />
            Create Order
          </Button>
        </div>
        
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-muted-foreground">No orders found.</p>
            </div>
          ) : (
            orders.map(order => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg">Room {order.roomNumber} - {order.guestName}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}
                      </div>
                    </div>
                    <Badge className={
                      order.status === "delivered" ? "bg-green-100 text-green-800" :
                      order.status === "cancelled" ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    }>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <div className="text-sm">
                          {item.quantity} × {item.name}
                        </div>
                        <div className="text-sm font-medium">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                    
                    {order.specialInstructions && (
                      <div className="text-sm italic border-t pt-2 mt-2">
                        Note: {order.specialInstructions}
                      </div>
                    )}
                    
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <div className="font-medium">Total</div>
                      <div className="font-medium">₹{order.totalAmount}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {order.status === "pending" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
                      >
                        Mark Delivered
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Item Dialog */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentItem ? "Edit Item" : "Add New Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveItem}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={currentItem?.name || ""} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={currentItem?.category || "Food"}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                    <SelectItem value="Amenities">Amenities</SelectItem>
                    <SelectItem value="Laundry">Laundry</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  defaultValue={currentItem?.price || ""} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={currentItem?.description || ""} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={currentItem?.status || "available"}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{currentItem ? "Update" : "Add"} Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveOrder}>
            <div className="grid gap-4 py-4">
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
              
              <div className="border rounded-md p-3">
                <h4 className="font-medium mb-2">Selected Items</h4>
                {selectedItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No items selected. Add items from the menu.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="text-sm">{item.name} (₹{item.price})</div>
                        <div className="flex items-center gap-2">
                          <Button 
                            type="button"
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="text-sm w-6 text-center">{item.quantity}</span>
                          <Button 
                            type="button"
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button 
                            type="button"
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-red-500" 
                            onClick={() => handleRemoveFromOrder(item.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <div className="font-medium">Total</div>
                        <div className="font-medium">
                          ₹{selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea id="specialInstructions" name="specialInstructions" placeholder="Any special requests or instructions..." />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={selectedItems.length === 0}>Create Order</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
