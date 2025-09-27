"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import BookingHeader from "./_components/BookingHeader";
import BookingList from "./_components/BookingList";
import Pagination from "./_components/Pagination";
import {
  getStatusColor,
  getStatusIcon,
  getStatusText,
} from "./_components/StatusUtils";
import { Booking } from "./_components/types";

export default function MyBookingsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedBookingId, setHighlightedBookingId] = useState<string | null>(
    null
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleBookingCancelled = (bookingId: string) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "CANCELLED" as const }
          : booking
      )
    );
  };

  const sortedBookings = useMemo(() => {
    return bookings.sort((a, b) => {
      const statusOrder = { APPROVED: 0, PENDING: 1, EXPIRED: 2, CANCELLED: 3 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];

      if (statusDiff === 0) {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      }

      return statusDiff;
    });
  }, [bookings]);

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = sortedBookings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session?.user?.id) return;

      try {
        setIsLoading(true);

        try {
          await fetch("/api/me/bookings/update-expired", {
            method: "POST",
          });
        } catch (expiredErr) {
          console.warn("Failed to update expired bookings:", expiredErr);
        }

        const response = await fetch("/api/me/bookings");

        if (response.ok) {
          const data = await response.json();

          const now = new Date();
          const updatedBookings = data.map((booking: Booking) => {
            const bookingTime = new Date(booking.dateTime);
            if (
              bookingTime < now &&
              booking.status !== "CANCELLED" &&
              booking.status !== "EXPIRED"
            ) {
              return { ...booking, status: "EXPIRED" as const };
            }
            return booking;
          });

          setBookings(updatedBookings);
        } else {
          setError("Failed to fetch bookings");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [session?.user?.id]);

  useEffect(() => {
    const bookingId = searchParams.get("booking");
    if (bookingId) {
      setHighlightedBookingId(bookingId);

      setTimeout(() => {
        setHighlightedBookingId(null);
      }, 3000);
    }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [bookings.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setBookings((prevBookings) =>
        prevBookings.map((booking) => {
          const bookingTime = new Date(booking.dateTime);
          if (
            bookingTime < now &&
            booking.status !== "CANCELLED" &&
            booking.status !== "EXPIRED"
          ) {
            return { ...booking, status: "EXPIRED" as const };
          }
          return booking;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <BookingHeader bookingCount={bookings.length} />

        <BookingList
          bookings={paginatedBookings}
          isLoading={isLoading}
          error={error}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          getStatusText={getStatusText}
          onBookingCancelled={handleBookingCancelled}
          highlightedBookingId={highlightedBookingId}
        />

        {/* Pagination */}
        {!isLoading && !error && bookings.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={bookings.length}
          />
        )}
      </div>
    </div>
  );
}
