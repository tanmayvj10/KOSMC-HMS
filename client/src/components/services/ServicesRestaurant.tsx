
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

interface MenuItem {
  id: string;
  name: string;
  category: "Starters" | "Main Course" | "Desserts" | "Beverages" | "Breakfast" | "Lunch" | "Dinner";
  price: number;
  description: string;
  preparationTime: string;
  isVegetarian: boolean;
  isAvailable: boolean;
}

interface Order {
  id: string;
  tableNumber: string;
  roomNumber?: string;
  customerName: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  status: "pending" | "preparing" | "served" | "completed" | "cancelled";
  specialInstructions?: string;
  date: string;
}

export function ServicesRestaurant() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "menu-1",
      name: "Paneer Tikka",
      category: "Starters",
      price: 299,
      description: "Grilled cottage cheese with spices and vegetables",
      preparationTime: "20 mins",
      isVegetarian: true,
      isAvailable: true
    },
    {
      id: "menu-2",
      name: "Butter Chicken",
      category: "Main Course",
      price: 399,
      description: "Tandoori chicken cooked in a rich tomato gravy",
      preparationTime: "30 mins",
      isVegetarian: false,
      isAvailable: true
    },
    {
      id: "menu-3",
      name: "Chocolate Brownie with Ice Cream",
      category: "Desserts",
      price: 249,
      description: "Warm chocolate brownie served with vanilla ice cream",
      preparationTime: "15 mins",
      isVegetarian: true,
      isAvailable: true
    },
    {
      id: "menu-4",
      name: "Fresh Fruit Salad",
      category: "Desserts",
      price: 199,
      description: "Seasonal fruits with honey and mint",
      preparationTime: "10 mins",
      isVegetarian: true,
      isAvailable: true
    },
    {
      id: "menu-5",
      name: "Classic Margarita",
      category: "Beverages",
      price: 349,
      description: "Cocktail with tequila, lime juice and orange liqueur",
      preparationTime: "5 mins",
      isVegetarian: true,
      isAvailable: true
    }
  ]);
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "order-1",
      tableNumber: "T12",
      roomNumber: "101",
      customerName: "Rahul Sharma",
      items: [
        { id: "menu-1", name: "Paneer Tikka", price: 299, quantity: 1 },
        { id: "menu-2", name: "Butter Chicken", price: 399, quantity: 1 },
      ],
      totalAmount: 698,
      status: "served",
      date: "2023-07-10T19:30:00"
    },
    {
      id: "order-2",
      tableNumber: "T05",
      customerName: "Walk-in Customer",
      items: [
        { id: "menu-3", name: "Chocolate Brownie with Ice Cream", price: 249, quantity: 2 },
        { id: "menu-5", name: "Classic Margarita", price: 349, quantity: 2 },
      ],
      totalAmount: 1196,
      status: "pending",
      date: "2023-07-11T20:15:00",
    }
  ]);
  
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const handleAddMenuItem = () => {
    setCurrentMenuItem(null);
    setMenuDialogOpen(true);
  };
  
  const handleEditMenuItem = (item: MenuItem) => {
    setCurrentMenuItem(item);
    setMenuDialogOpen(true);
  };
  
  const handleDeleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Menu item deleted",
      description: "The menu item has been deleted successfully",
    });
  };
  
  const handleSaveMenuItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const menuItemData = {
      name: formData.get("name") as string,
      category: formData.get("category") as "Starters" | "Main Course" | "Desserts" | "Beverages" | "Breakfast" | "Lunch" | "Dinner",
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description") as string,
      preparationTime: formData.get("preparationTime") as string,
      isVegetarian: formData.get("isVegetarian") === "true",
      isAvailable: formData.get("isAvailable") === "true",
    };
    
    if (currentMenuItem) {
      // Edit existing menu item
      setMenuItems(prev => 
        prev.map(item => 
          item.id === currentMenuItem.id 
            ? { ...item, ...menuItemData } 
            : item
        )
      );
      toast({
        title: "Menu item updated",
        description: `${menuItemData.name} has been updated successfully`,
      });
    } else {
      // Add new menu item
      const newMenuItem: MenuItem = {
        id: `menu-${Date.now()}`,
        ...menuItemData
      };
      setMenuItems(prev => [...prev, newMenuItem]);
      toast({
        title: "Menu item added",
        description: `${menuItemData.name} has been added successfully`,
      });
    }
    
    setMenuDialogOpen(false);
  };
  
  const handleCreateOrder = () => {
    setSelectedItems([]);
    setOrderDialogOpen(true);
  };
  
  const handleAddToOrder = (item: MenuItem) => {
    if (!item.isAvailable) return;
    
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
    
    if (selectedItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add at least one item to the order",
        variant: "destructive"
      });
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableNumber: formData.get("tableNumber") as string,
      roomNumber: formData.get("roomNumber") as string || undefined,
      customerName: formData.get("customerName") as string,
      items: selectedItems,
      totalAmount,
      status: "pending",
      specialInstructions: formData.get("specialInstructions") as string || undefined,
      date: new Date().toISOString()
    };
    
    setOrders(prev => [...prev, newOrder]);
    
    toast({
      title: "Order created",
      description: `Order for ${newOrder.customerName} has been created successfully`,
    });
    
    setOrderDialogOpen(false);
  };
  
  const handleUpdateOrderStatus = (id: string, status: "pending" | "preparing" | "served" | "completed" | "cancelled") => {
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
  
  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Restaurant Menu</h2>
        <div className="flex justify-between items-center mb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search menu..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddMenuItem} className="gap-1">
            <Plus size={16} />
            Add Menu Item
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMenuItems.length === 0 ? (
            <div className="text-center p-8 border rounded-lg col-span-full">
              <p className="text-muted-foreground">No menu items found matching your search.</p>
            </div>
          ) : (
            filteredMenuItems.map(item => (
              <Card key={item.id} className={!item.isAvailable ? "opacity-70" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {item.name}
                        {item.isVegetarian && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Veg</Badge>
                        )}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1">{item.category}</Badge>
                    </div>
                    <div className="space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditMenuItem(item)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteMenuItem(item.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex justify-between mt-2">
                    <p className="text-lg font-medium">₹{item.price}</p>
                    <p className="text-sm text-muted-foreground">Prep time: {item.preparationTime}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={!item.isAvailable}
                    onClick={() => handleAddToOrder(item)}
                  >
                    {item.isAvailable ? "Add to Order" : "Currently Unavailable"}
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
                      <CardTitle className="text-lg">
                        Table {order.tableNumber}
                        {order.roomNumber && <span> - Room {order.roomNumber}</span>}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {order.customerName} · {new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <Badge className={
                      order.status === "completed" ? "bg-green-100 text-green-800" :
                      order.status === "cancelled" ? "bg-red-100 text-red-800" :
                      order.status === "served" ? "bg-blue-100 text-blue-800" :
                      order.status === "preparing" ? "bg-orange-100 text-orange-800" :
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
                        onClick={() => handleUpdateOrderStatus(order.id, "preparing")}
                      >
                        Start Preparing
                      </Button>
                    </>
                  )}
                  
                  {order.status === "preparing" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateOrderStatus(order.id, "served")}
                    >
                      Mark as Served
                    </Button>
                  )}
                  
                  {order.status === "served" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateOrderStatus(order.id, "completed")}
                    >
                      Complete Order
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Menu Item Dialog */}
      <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentMenuItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveMenuItem}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Item Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={currentMenuItem?.name || ""} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={currentMenuItem?.category || "Main Course"}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Starters">Starters</SelectItem>
                    <SelectItem value="Main Course">Main Course</SelectItem>
                    <SelectItem value="Desserts">Desserts</SelectItem>
                    <SelectItem value="Beverages">Beverages</SelectItem>
                    <SelectItem value="Breakfast">Breakfast</SelectItem>
                    <SelectItem value="Lunch">Lunch</SelectItem>
                    <SelectItem value="Dinner">Dinner</SelectItem>
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
                  defaultValue={currentMenuItem?.price || ""} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={currentMenuItem?.description || ""} 
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="preparationTime">Preparation Time</Label>
                <Input 
                  id="preparationTime" 
                  name="preparationTime" 
                  defaultValue={currentMenuItem?.preparationTime || ""} 
                  required 
                  placeholder="e.g. 15 mins"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="isVegetarian">Vegetarian</Label>
                  <Select name="isVegetarian" defaultValue={currentMenuItem?.isVegetarian ? "true" : "false"}>
                    <SelectTrigger id="isVegetarian">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="isAvailable">Available</Label>
                  <Select name="isAvailable" defaultValue={currentMenuItem?.isAvailable ? "true" : "false"}>
                    <SelectTrigger id="isAvailable">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{currentMenuItem ? "Update" : "Add"} Menu Item</Button>
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
                  <Label htmlFor="tableNumber">Table Number</Label>
                  <Input id="tableNumber" name="tableNumber" required placeholder="e.g. T12" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="roomNumber">Room Number (Optional)</Label>
                  <Input id="roomNumber" name="roomNumber" placeholder="For in-room dining" />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input id="customerName" name="customerName" required />
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
                <Textarea id="specialInstructions" name="specialInstructions" placeholder="Any special requests or dietary restrictions..." />
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
