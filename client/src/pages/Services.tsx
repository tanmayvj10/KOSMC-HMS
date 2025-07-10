
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServicesActivities } from "@/components/services/ServicesActivities";
import { ServicesRoomService } from "@/components/services/ServicesRoomService";
import { ServicesRestaurant } from "@/components/services/ServicesRestaurant";

const Services = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hotel Services</h1>
        <p className="text-muted-foreground">Manage hotel services and guest activities</p>
      </div>

      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="roomServices">Room Services</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activities" className="space-y-4 mt-4">
          <ServicesActivities />
        </TabsContent>
        
        <TabsContent value="roomServices" className="space-y-4 mt-4">
          <ServicesRoomService />
        </TabsContent>
        
        <TabsContent value="restaurant" className="space-y-4 mt-4">
          <ServicesRestaurant />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Services;
