"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BookingHeaderProps {
  bookingCount: number;
}

export default function BookingHeader({ bookingCount }: BookingHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <Link href="/reservation">
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Booking
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-1">
          {bookingCount} appointment{bookingCount !== 1 ? "s" : ""} found
        </p>
      </div>
    </div>
  );
}
