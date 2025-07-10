
// Common types for the hotel management system

// User roles
export type UserRole = "admin" | "manager" | "restaurant";

// Staff types
export interface StaffMember {
  id: string;
  name: string;
  position: string;
  department: "management" | "housekeeping" | "reception" | "restaurant" | "security";
  reportTo?: string;
  phone: string;
  email?: string;
  joiningDate: string;
  status: "active" | "on-leave" | "terminated";
  image?: string;
}

// Room types
export interface Room {
  id: string;
  number: string;
  type: string;
  capacity: number;
  price: number;
  status: "available" | "occupied" | "maintenance" | "reserved";
  amenities: string[];
  images?: string[];
  floor: number;
  lastCleaned?: string;
  qrCode?: string;
}

// Guest types
export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  idType: string;
  idNumber: string;
  nationality: string;
  vipStatus?: boolean;
  visits: number;
  lastStay?: string;
  notes?: string;
}

// Reservation types
export interface Reservation {
  id: string;
  guestId: string;
  guestName: string;
  roomId: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalAmount: number;
  status: "confirmed" | "checked-in" | "checked-out" | "cancelled";
  paymentStatus: "paid" | "pending" | "partial";
  specialRequests?: string;
  createdAt: string;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description?: string;
  category: "restaurant" | "roomService" | "activity" | "other";
  price: number;
  available: boolean;
  image?: string;
}

// Service order types
export interface ServiceOrder {
  id: string;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  orderedAt: string;
  notes?: string;
}

// Invoice and billing types
export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  type: "room" | "service" | "tax" | "discount" | "other";
  serviceId?: string;
  date?: string;
}

export interface Invoice {
  id: string;
  guestName: string;
  guestId?: string;
  roomNumber: string;
  reservationId?: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  createdAt: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: "cash" | "card" | "bank" | "upi";
  items: InvoiceItem[];
}

// API Integration types
export interface ApiIntegration {
  name: string;
  enabled: boolean;
  apiKey?: string;
  apiSecret?: string;
  endpoint?: string;
  lastSync?: string;
  status: "active" | "inactive" | "error";
}
