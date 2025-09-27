"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import SlotsGrid from "./SlotsGrid";
import {
  generateTimeSlots,
  formatDate,
  ExistingBooking,
} from "@/lib/reservation-utils";
import { useBooking } from "@/contexts/BookingContext";
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";

const SlotsSection = () => {
  const { state } = useBooking();
  const { selectedDate, selection } = state;
  const { data: session } = useSession();
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);

  const currentDate = useMemo(() => selectedDate || new Date(), [selectedDate]);
  const isToday = currentDate.toDateString() === new Date().toDateString();
  const isSunday = currentDate.getDay() === 0;

  useEffect(() => {
    if (!currentDate || isSunday) {
      setExistingBookings([]);
      return;
    }

    const fetchBookings = async () => {
      try {
        const dateString = currentDate.toISOString().split("T")[0];
        const userId = session?.user?.id;

        const url = new URL("/api/public/bookings", window.location.origin);
        url.searchParams.set("date", dateString);

        if (userId) {
          url.searchParams.set("userId", userId);
        }

        const response = await fetch(url.toString());

        if (response.ok) {
          const bookings = await response.json();
          setExistingBookings(bookings);
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch bookings:", {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
          });
          setExistingBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setExistingBookings([]);
      }
    };

    fetchBookings();
  }, [currentDate, isSunday, session?.user?.id]);

  const allTimeSlots = generateTimeSlots(currentDate, existingBookings);
  const availableSlots = allTimeSlots;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Times for {formatDate(currentDate)}</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Click any available time to book. Gray slots are not available.
        </p>
      </CardHeader>
      <CardContent>
        {isSunday ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Closed on Sundays
            </h3>
            <p className="text-gray-600">
              We&apos;re closed on Sundays. Please select a different day.
            </p>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Available Slots
            </h3>
            <p className="text-gray-600">
              {selection.requiredSlots > 0
                ? `No time slots available for ${selection.roundedDurationMin} minutes on this date. Please select another day or adjust your selection.`
                : "No time slots available for this date. Please select another day."}
            </p>
          </div>
        ) : (
          <SlotsGrid slots={availableSlots} isToday={isToday} />
        )}
      </CardContent>
    </Card>
  );
};

export default SlotsSection;
