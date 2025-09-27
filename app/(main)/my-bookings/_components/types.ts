export interface Booking {
  id: string;
  dateTime: string;
  status: "PENDING" | "APPROVED" | "CANCELLED" | "EXPIRED";
  duration: number;
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
  package?: {
    id: string;
    name: string;
    duration: number;
    price: number;
    services: Array<{
      id: string;
      name: string;
      duration: number;
      price: number;
    }>;
  } | null;
  services?: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }> | null;
  createdAt: string;
  updatedAt: string;
}
