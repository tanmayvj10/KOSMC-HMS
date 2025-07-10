
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { RoomStatusWidget } from "@/components/dashboard/RoomStatusWidget";
import { RecentBookingsTable } from "@/components/dashboard/RecentBookingsTable";
import { TodayActivityCard } from "@/components/dashboard/TodayActivityCard";
import { Bed, Calendar, IndianRupee, Users } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  // Current date for display
  const today = new Date();
  const formattedDate = format(today, "dd MMM yyyy");

  // Current values for the dashboard - updated to reflect real-time stats
  const dashboardStats = {
    todayRevenue: 18650,
    bookingsToday: 34,
    occupancyPercent: 72,
    occupiedRooms: 47,
    newReservations: 15,
    activeGuests: 82,
    newCheckIns: 14,
    trendRevenue: 14,
    trendOccupancy: 6,
    trendReservations: -2,
    trendGuests: 10,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Hotel overview and key metrics as of {formattedDate}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={`₹${dashboardStats.todayRevenue.toLocaleString('en-IN')}`}
          description={`${dashboardStats.bookingsToday} room bookings`}
          icon={<IndianRupee size={20} />}
          trend={{ value: dashboardStats.trendRevenue, isPositive: dashboardStats.trendRevenue > 0 }}
        />
        <StatCard
          title="Room Occupancy"
          value={`${dashboardStats.occupancyPercent}%`}
          description={`${dashboardStats.occupiedRooms} rooms occupied`}
          icon={<Bed size={20} />}
          trend={{ value: dashboardStats.trendOccupancy, isPositive: dashboardStats.trendOccupancy > 0 }}
        />
        <StatCard
          title="New Reservations"
          value={`${dashboardStats.newReservations}`}
          description="Last 24 hours"
          icon={<Calendar size={20} />}
          trend={{ value: Math.abs(dashboardStats.trendReservations), isPositive: dashboardStats.trendReservations > 0 }}
        />
        <StatCard
          title="Active Guests"
          value={`${dashboardStats.activeGuests}`}
          description={`${dashboardStats.newCheckIns} new check-ins today`}
          icon={<Users size={20} />}
          trend={{ value: dashboardStats.trendGuests, isPositive: dashboardStats.trendGuests > 0 }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: RoomStatusWidget and RecentBookingsTable */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <RoomStatusWidget />
          <RecentBookingsTable />
        </div>

        {/* Right column: TodayActivityCard */}
        <div className="h-full">
          <TodayActivityCard />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
