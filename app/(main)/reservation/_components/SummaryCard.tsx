"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Scissors,
  Package,
  DollarSign,
  Loader2,
} from "lucide-react";
import { formatDate, formatTime, generateTimeSlots } from "@/lib/reservation-utils";
import { useBooking } from "@/contexts/BookingContext";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SummaryCardComponent() {
  const { state, canProceed } = useBooking();
  const { selectedDate, selectedSlots, selection, selectionError } = state;
  const { data: session } = useSession();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatSelectedSlots = () => {
    if (selectedSlots.length === 0) return "—";

    const allSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

    const selectedSlotObjects = allSlots.filter((slot) =>
      selectedSlots.includes(slot.id)
    );

    if (selectedSlotObjects.length === 0) return "—";

    selectedSlotObjects.sort((a, b) => a.time.localeCompare(b.time));

    if (selectedSlotObjects.length === 1) {
      const singleSlot = selectedSlotObjects[0];
      const [hours, minutes] = singleSlot.time.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        console.error("Invalid time format:", singleSlot.time);
        return formatTime(singleSlot.time);
      }

      const endTimeMinutes = hours * 60 + minutes + 30;
      const endHours = Math.floor(endTimeMinutes / 60);
      const endMins = endTimeMinutes % 60;

      const finalHours = endHours % 24;
      const endTimeString = `${finalHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;

      return `${formatTime(singleSlot.time)} - ${formatTime(endTimeString)}`;
    } else {
      const firstSlot = selectedSlotObjects[0];
      const lastSlot = selectedSlotObjects[selectedSlotObjects.length - 1];

      const [hours, minutes] = lastSlot.time.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) {
        console.error("Invalid time format:", lastSlot.time);
        return formatTime(firstSlot.time);
      }

      const endTimeMinutes = hours * 60 + minutes + 30;
      const endHours = Math.floor(endTimeMinutes / 60);
      const endMins = endTimeMinutes % 60;

      const finalHours = endHours % 24;
      const endTimeString = `${finalHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;

      const startTimeDisplay = formatTime(firstSlot.time);
      const endTimeDisplay = formatTime(endTimeString);

      return `${startTimeDisplay} - ${endTimeDisplay}`;
    }
  };

  const getSelectedItems = () => {
    if (selection.mode === "services") {
      return state.services.filter((service) =>
        selection.selectedServiceIds.includes(service.id)
      );
    } else if (selection.mode === "package" && selection.selectedPackageId) {
      return state.packages.filter((pkg) => pkg.id === selection.selectedPackageId);
    }
    return [];
  };

  const selectedItems = getSelectedItems();

  const handleCreateBooking = async () => {
    if (!session?.user?.id || !selectedDate || selectedSlots.length === 0) {
      setError("Please log in and select a date and time");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const allSlots = generateTimeSlots(selectedDate);
      const selectedSlotObjects = allSlots.filter((slot) =>
        selectedSlots.includes(slot.id)
      );
      selectedSlotObjects.sort((a, b) => a.time.localeCompare(b.time));

      if (selectedSlotObjects.length === 0) {
        throw new Error("No valid time slots selected");
      }

      const firstSlot = selectedSlotObjects[0];
      const [hours, minutes] = firstSlot.time.split(":").map(Number);

      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      const bookingData = {
        serviceIds:
          selection.mode === "services" ? selection.selectedServiceIds : undefined,
        packageId:
          selection.mode === "package" ? selection.selectedPackageId : undefined,
        dateTime: bookingDateTime.toISOString(),
        duration: selection.roundedDurationMin,
      };

      const response = await fetch("/api/me/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create booking";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let booking;
      try {
        booking = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse booking response:", jsonError);
        throw new Error("Invalid response from server");
      }

      router.push(`/my-bookings?booking=${booking.id}`);
    } catch (err) {
      console.error("Booking creation failed:", err);
      setError(err instanceof Error ? err.message : "Failed to create booking");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="sticky top-18">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Your Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Date</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {selectedDate ? formatDate(selectedDate) : "—"}
          </span>
        </div>

        <Separator />

        {/* Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Time</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {formatSelectedSlots()}
          </span>
        </div>

        <Separator />

        {/* Selected Items */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {selection.mode === "services" ? (
              <Scissors className="h-4 w-4" />
            ) : (
              <Package className="h-4 w-4" />
            )}
            <span>{selection.mode === "services" ? "Services" : "Package"}</span>
          </div>

          {selectedItems.length > 0 ? (
            <div className="space-y-1">
              {selectedItems.map((item) => (
                <div key={item.id} className="text-sm">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-600">
                    {item.duration} min • ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No selection</span>
          )}
        </div>

        <Separator />

        {/* Duration Summary */}
        {selection.computedDurationMin > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Duration</span>
              <div className="text-sm">
                <div className="font-medium">
                  {selection.roundedDurationMin} minutes
                </div>
                {selection.computedDurationMin !== selection.roundedDurationMin && (
                  <div className="text-xs text-gray-500">
                    (rounded from {selection.computedDurationMin} min)
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Required Slots</span>
              <span className="text-sm font-medium">{selection.requiredSlots}</span>
            </div>
          </>
        )}

        <Separator />

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span>Subtotal</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            ${selection.subtotalPrice.toFixed(2)}
          </span>
        </div>

        <Separator />

        {/* Slot Selection Status */}
        {selection.requiredSlots > 0 && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">Slots Selected:</span>
              <span className="font-medium text-blue-900">
                {selectedSlots.length} of {selection.requiredSlots}
              </span>
            </div>
            {selectedSlots.length < selection.requiredSlots && (
              <p className="text-xs text-blue-600 mt-1">
                Select {selection.requiredSlots - selectedSlots.length} more slot
                {selection.requiredSlots - selectedSlots.length > 1 ? "s" : ""}
              </p>
            )}
          </div>
        )}

        {/* Error Display */}
        {selectionError && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{selectionError}</p>
          </div>
        )}

        {/* Booking Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Continue Button */}
        <Button
          className="w-full"
          disabled={!canProceed || isCreating}
          onClick={handleCreateBooking}
          aria-disabled={!canProceed || isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Booking...
            </>
          ) : (
            "Continue"
          )}
        </Button>

        {/* Helper Text */}
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p className="font-medium mb-1">Note:</p>
          <p>
            Selected service/package duration will round to 30 or 60 minutes and
            block {selection.requiredSlots} consecutive slot
            {selection.requiredSlots > 1 ? "s" : ""}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
export function ReservationSummaryCard() {
  return <SummaryCardComponent />;
}
