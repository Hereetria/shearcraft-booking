"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Scissors,
  Package,
  DollarSign,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/reservation-utils";
import { useState, useEffect } from "react";

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

interface BookingCardProps {
  booking: Booking;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusText: (status: string) => string;
  onBookingCancelled?: (bookingId: string) => void;
  isHighlighted?: boolean;
}

export default function BookingCard({
  booking,
  getStatusColor,
  getStatusIcon,
  getStatusText,
  onBookingCancelled,
  isHighlighted = false,
}: BookingCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (showCancelConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showCancelConfirm]);

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleCancelConfirm = async () => {
    setShowCancelConfirm(false);
    setIsCancelling(true);
    setCancelError(null);

    try {
      const response = await fetch(`/api/me/bookings/${booking.id}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        if (onBookingCancelled) {
          onBookingCancelled(booking.id);
        }
      } else {
        const errorData = await response.json();
        setCancelError(errorData.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setCancelError("Failed to cancel booking. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelCancel = () => {
    setShowCancelConfirm(false);
  };

  const formatBookingDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: formatDate(date),
      time: formatTime(date.toTimeString().split(" ")[0].substring(0, 5)),
    };
  };

  const calculateTotalPrice = (booking: Booking) => {
    if (booking.package) {
      return booking.package.price;
    }
    if (booking.services && booking.services.length > 0) {
      return booking.services.reduce(
        (sum: number, service) => sum + service.price,
        0
      );
    }
    if (booking.service) {
      return booking.service.price;
    }
    return 0;
  };

  const getBookingType = (booking: Booking) => {
    if (booking.package) {
      return {
        type: "Package",
        name: booking.package.name,
        duration: booking.package.duration,
        icon: Package,
      };
    }
    if (booking.services && booking.services.length > 0) {
      return {
        type: "Services",
        name:
          booking.services.length === 1
            ? booking.services[0].name
            : `${booking.services[0].name}, ${booking.services[1].name}${booking.services.length > 2 ? "..." : ""}`,
        duration: booking.services.reduce(
          (sum: number, service) => sum + service.duration,
          0
        ),
        icon: Scissors,
        services: booking.services,
      };
    }
    if (booking.service) {
      return {
        type: "Service",
        name: booking.service.name,
        duration: booking.service.duration,
        icon: Scissors,
      };
    }
    return {
      type: "Unknown",
      name: "Unknown",
      duration: 0,
      icon: AlertCircle,
    };
  };

  const bookingDateTime = formatBookingDateTime(booking.dateTime);
  const bookingType = getBookingType(booking);
  const totalPrice = calculateTotalPrice(booking);
  const IconComponent = bookingType.icon;

  const getCardClassName = () => {
    const baseClass = "transition-shadow";

    if (isHighlighted) {
      return `${baseClass} ring-2 ring-blue-500 bg-blue-50 hover:shadow-md`;
    }

    if (booking.status === "PENDING" || booking.status === "APPROVED") {
      return `${baseClass} hover:shadow-sm`;
    }

    return `${baseClass} hover:shadow-md`;
  };

  return (
    <Card className={getCardClassName()}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Booking Header */}
            <div className="flex items-center gap-3 mb-4">
              <IconComponent className="h-5 w-5 text-gray-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {bookingType.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {bookingType.type} • {bookingType.duration} minutes
                </p>
              </div>
            </div>

            {/* Date and Time */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{bookingDateTime.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{bookingDateTime.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-medium">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Package Services (if applicable) */}
            {booking.package && booking.package.services.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Includes:</p>
                <div className="flex flex-wrap gap-2">
                  {booking.package.services.map((service) => (
                    <Badge key={service.id} variant="outline" className="text-xs">
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Multiple Services (if applicable) */}
            {booking.services && booking.services.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Services:</p>
                  {booking.services.length > 2 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3 w-3" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3 w-3" />
                          Show all
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(isExpanded
                    ? booking.services
                    : booking.services.slice(0, 2)
                  ).map(
                    (service: {
                      id: string;
                      name: string;
                      duration: number;
                      price: number;
                    }) => (
                      <Badge key={service.id} variant="outline" className="text-xs">
                        {service.name}
                      </Badge>
                    )
                  )}
                  {!isExpanded && booking.services.length > 2 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      +{booking.services.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Booking Details */}
            <div className="text-xs text-gray-500">
              <p>Booked on {formatDate(new Date(booking.createdAt))}</p>
              {booking.updatedAt !== booking.createdAt && (
                <p>Updated on {formatDate(new Date(booking.updatedAt))}</p>
              )}
            </div>

            {/* Cancel Error */}
            {cancelError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{cancelError}</p>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-2">
            <Badge
              className={`${getStatusColor(booking.status)} border flex items-center gap-1 mr-2`}
            >
              {getStatusIcon(booking.status)}
              {getStatusText(booking.status)}
            </Badge>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {booking.status === "PENDING" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelClick}
                  disabled={isCancelling}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel"
                  )}
                </Button>
              )}
              {booking.status === "APPROVED" && (
                <Button variant="outline" size="sm" disabled>
                  Reschedule
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <>
          {/* Backdrop with blur and prevent scroll */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
            }}
            onClick={handleCancelCancel}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancel Booking
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot be
                undone.
              </p>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={handleCancelCancel}
                  disabled={isCancelling}
                >
                  Keep Booking
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelConfirm}
                  disabled={isCancelling}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Yes, Cancel Booking"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
