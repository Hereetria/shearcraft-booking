"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import SlotsGrid from "./SlotsGrid";
import {
  generateTimeSlots,
  formatDate,
  ExistingBooking,
} from "@/lib/reservation-utils";
import { useBooking } from "@/contexts/BookingContext";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";

const SlotsSection = () => {
  const { state } = useBooking();
  const { selectedDate, selection } = state;
  const { data: session, status } = useSession();
  const [existingBookings, setExistingBookings] = useState<ExistingBooking[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);

  const currentDate = useMemo(() => selectedDate || new Date(), [selectedDate]);
  const isToday = currentDate.toDateString() === new Date().toDateString();
  const isSunday = currentDate.getDay() === 0;

  const fetchBookings = useCallback(
    async (showLoading = false) => {
      if (!currentDate || isSunday) {
        setExistingBookings([]);
        setIsLoadingBookings(false);
        return;
      }

      // Wait for session to be loaded before fetching bookings
      // This prevents the issue where bookings are fetched without userId on first load
      if (status === "loading") {
        return; // Session is still loading
      }

      if (showLoading) {
        setIsRefreshing(true);
      } else {
        setIsLoadingBookings(true);
      }

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
      } finally {
        if (showLoading) {
          setIsRefreshing(false);
        } else {
          setIsLoadingBookings(false);
        }
      }
    },
    [currentDate, isSunday, status, session?.user?.id]
  );

  useEffect(() => {
    // Reset loading state when date changes
    setIsLoadingBookings(true);
    fetchBookings();
  }, [fetchBookings]);

  // Refresh bookings when the page becomes visible (user returns from my-bookings)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchBookings(true); // Show loading indicator
      }
    };

    const handleFocus = () => {
      fetchBookings(true); // Show loading indicator
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // Refresh when user navigates back to the page (including from my-bookings)
      if (event.persisted || performance.navigation.type === 2) {
        fetchBookings(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [fetchBookings]);

  const allTimeSlots = generateTimeSlots(currentDate, existingBookings);
  const availableSlots = allTimeSlots;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Available Times for {formatDate(currentDate)}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Click any available time to book. Gray slots are not available.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBookings(true)}
            disabled={isRefreshing || status === "loading" || isLoadingBookings}
            className="ml-4"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {status === "loading" || isLoadingBookings ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading Available Times
            </h3>
            <p className="text-gray-600">
              Please wait while we load the available time slots...
            </p>
          </div>
        ) : isSunday ? (
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
