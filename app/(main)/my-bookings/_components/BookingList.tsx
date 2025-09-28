"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import BookingCard from "./BookingCard";

interface Booking {
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

interface BookingListProps {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
  onBookingCancelled?: (bookingId: string) => void;
  highlightedBookingId?: string | null;
}

export default function BookingList({
  bookings,
  isLoading,
  error,
  getStatusColor,
  getStatusIcon,
  getStatusText,
  onBookingCancelled,
  highlightedBookingId,
}: BookingListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Your Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Bookings Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t made any bookings yet. Start by booking an
              appointment!
            </p>
            <Link href="/reservation">
              <Button>
                <Clock className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          getStatusText={getStatusText}
          onBookingCancelled={onBookingCancelled}
          isHighlighted={highlightedBookingId === booking.id}
        />
      ))}
    </div>
  );
}
