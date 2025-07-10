
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { QrCode, Shield, Key, RefreshCw } from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [isMetaConnected, setIsMetaConnected] = useState(false);
  const [isStaahConnected, setIsStaahConnected] = useState(false);

  // Meta API Form Schema
  const metaFormSchema = z.object({
    apiKey: z.string().min(1, { message: "API Key is required" }),
    apiSecret: z.string().min(1, { message: "API Secret is required" }),
    pageId: z.string().min(1, { message: "Page ID is required" }),
  });

  // STAAH API Form Schema
  const staahFormSchema = z.object({
    apiKey: z.string().min(1, { message: "API Key is required" }),
    propertyId: z.string().min(1, { message: "Property ID is required" }),
    endpoint: z.string().url({ message: "Must be a valid URL" }),
  });

  // Password Form Schema
  const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  // User role schema
  const userRoleSchema = z.object({
    role: z.enum(["admin", "manager", "restaurant"]),
  });

  // Form hooks
  const metaForm = useForm<z.infer<typeof metaFormSchema>>({
    resolver: zodResolver(metaFormSchema),
    defaultValues: {
      apiKey: "",
      apiSecret: "",
      pageId: "",
    },
  });

  const staahForm = useForm<z.infer<typeof staahFormSchema>>({
    resolver: zodResolver(staahFormSchema),
    defaultValues: {
      apiKey: "",
      propertyId: "",
      endpoint: "https://api.staah.com/v1/",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const roleForm = useForm<z.infer<typeof userRoleSchema>>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      role: (localStorage.getItem("userRole") as "admin" | "manager" | "restaurant") || "admin",
    },
  });

  // Form submit handlers
  const onMetaSubmit = (values: z.infer<typeof metaFormSchema>) => {
    toast({
      title: "Meta API Connected",
      description: "Your Facebook page has been connected successfully.",
    });
    setIsMetaConnected(true);
    console.log(values);
  };

  const onStaahSubmit = (values: z.infer<typeof staahFormSchema>) => {
    toast({
      title: "STAAH API Connected",
      description: "Your STAAH property has been connected successfully.",
    });
    setIsStaahConnected(true);
    console.log(values);
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
    });
    passwordForm.reset();
    console.log(values);
  };

  const onRoleChange = (values: z.infer<typeof userRoleSchema>) => {
    localStorage.setItem("userRole", values.role);
    toast({
      title: "Role Changed",
      description: `You are now using the application as ${values.role.charAt(0).toUpperCase() + values.role.slice(1)}`,
    });
    window.location.reload(); // Reload to apply new role permissions
  };

  // QR Code generation for all rooms
  const generateQRCodesForAllRooms = () => {
    setIsGeneratingQR(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsGeneratingQR(false);
      toast({
        title: "QR Codes Generated",
        description: "QR codes for all rooms have been regenerated.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your hotel settings, integrations and security
        </p>
      </div>

      <Tabs defaultValue="integrations">
        <TabsList className="mb-6">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>
        
        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          {/* Meta/Facebook API */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" fill="none">
                  <path d="M48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 35.9789 8.77852 45.908 20.25 47.7084V30.9375H14.1562V24H20.25V18.7125C20.25 12.6975 23.8331 9.375 29.3152 9.375C31.9402 9.375 34.6875 9.84375 34.6875 9.84375V15.75H31.6613C28.68 15.75 27.75 17.6002 27.75 19.5V24H34.4062L33.3422 30.9375H27.75V47.7084C39.2215 45.908 48 35.9789 48 24Z" fill="#1877F2"/>
                  <path d="M33.3422 30.9375L34.4062 24H27.75V19.5C27.75 17.602 28.68 15.75 31.6613 15.75H34.6875V9.84375C34.6875 9.84375 31.9411 9.375 29.3152 9.375C23.8331 9.375 20.25 12.6975 20.25 18.7125V24H14.1562V30.9375H20.25V47.7084C22.7349 48.0972 25.2651 48.0972 27.75 47.7084V30.9375H33.3422Z" fill="white"/>
                </svg>
                Meta API Integration
              </CardTitle>
              <CardDescription>
                Connect your Facebook page to sync reviews and messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMetaConnected ? (
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span>Connected to Meta API</span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsMetaConnected(false)}
                    className="w-full sm:w-auto"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Form {...metaForm}>
                  <form onSubmit={metaForm.handleSubmit(onMetaSubmit)} className="space-y-4">
                    <FormField
                      control={metaForm.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your Meta API key" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={metaForm.control}
                      name="apiSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Secret</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your Meta API secret" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={metaForm.control}
                      name="pageId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook Page ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your Facebook page ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Connect to Meta API</Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* STAAH API */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" rx="4" fill="#0059B3"/>
                  <path d="M5 7H8.5L11 12L13.5 7H17L13 14L17 21H13.5L11 16L8.5 21H5L9 14L5 7Z" fill="white"/>
                </svg>
                STAAH API Integration
              </CardTitle>
              <CardDescription>
                Connect to STAAH for room inventory and rate management
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isStaahConnected ? (
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span>Connected to STAAH API</span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsStaahConnected(false)}
                    className="w-full sm:w-auto"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Form {...staahForm}>
                  <form onSubmit={staahForm.handleSubmit(onStaahSubmit)} className="space-y-4">
                    <FormField
                      control={staahForm.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your STAAH API key" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={staahForm.control}
                      name="propertyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your STAAH property ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={staahForm.control}
                      name="endpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Endpoint</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the API endpoint" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Connect to STAAH</Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* QR Code Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Management
              </CardTitle>
              <CardDescription>
                Manage QR codes for all rooms in your hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="qr-base-url">Base URL for Room QR Codes</Label>
                  <Input 
                    id="qr-base-url" 
                    placeholder="https://example.com/room/" 
                    defaultValue="https://kosmc-hotel.com/roomservice/"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    This URL will be used as base for all room QR codes. Room number will be appended.
                  </p>
                </div>
                <div>
                  <Label htmlFor="qr-size">QR Code Size (px)</Label>
                  <Input 
                    id="qr-size" 
                    type="number" 
                    placeholder="300" 
                    defaultValue="300"
                    min="100"
                    max="1000"
                  />
                </div>
              </div>
              <Button 
                onClick={generateQRCodesForAllRooms} 
                disabled={isGeneratingQR}
                className="w-full sm:w-auto mt-2"
              >
                {isGeneratingQR ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : "Regenerate All QR Codes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Password Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Password</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Account Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Account Activity</CardTitle>
              <CardDescription>
                Recent login activity for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Current Session</span>
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">Active</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Today, {new Date().toLocaleTimeString()}</div>
                  <div className="text-sm text-muted-foreground">Browser: {navigator.userAgent.match(/chrome|firefox|safari|edge|opera/i)?.[0]}</div>
                  <div className="text-sm text-muted-foreground">IP: 192.168.1.1</div>
                </div>
                <Separator />
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Previous Login</span>
                    <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs">Ended</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Yesterday, 14:32:21</div>
                  <div className="text-sm text-muted-foreground">Browser: Chrome</div>
                  <div className="text-sm text-muted-foreground">IP: 192.168.1.1</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          {/* User Role Simulation */}
          <Card>
            <CardHeader>
              <CardTitle>User Role Simulation</CardTitle>
              <CardDescription>
                Change your user role to test different permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...roleForm}>
                <form onChange={roleForm.handleSubmit(onRoleChange)} className="space-y-4">
                  <FormField
                    control={roleForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Role</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="restaurant">Restaurant Staff</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          This will change what features you can access in the system
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Details about the current system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Hotel Keeper Version:</span>
                  <span className="font-medium">1.2.3</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Database Version:</span>
                  <span className="font-medium">2.1.0</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
