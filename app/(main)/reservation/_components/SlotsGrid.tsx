"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { TimeSlot } from "@/lib/reservation-utils";
import { cn } from "@/lib/utils";
import { useBooking } from "@/contexts/BookingContext";

interface SlotsGridProps {
  slots: TimeSlot[];
  isToday: boolean;
}

export default function SlotsGrid({ slots, isToday: _isToday }: SlotsGridProps) {
  const { state, toggleSlot } = useBooking();
  const { selectedSlots, selection, selectionError } = state;
  const requiredSlots = selection.requiredSlots;
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const hasSelection =
    (selection.mode === "services" && selection.selectedServiceIds.length > 0) ||
    (selection.mode === "package" && selection.selectedPackageId !== null);

  const handleSlotClick = (slot: TimeSlot) => {
    const status = getSlotStatus(slot);
    const isForbidden = isSlotForbidden(slot);

    if (status === "past") {
      return;
    }

    if (status === "ownBooking") {
      window.location.href = "/my-bookings";
      return;
    }

    if (!hasSelection) {
      return;
    }

    if ((status === "available" && !isForbidden) || status === "selected") {
      toggleSlot(slot.id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, slot: TimeSlot) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSlotClick(slot);
    }
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (selectedSlots.includes(slot.id)) return "selected";
    if (!slot.isAvailable) {
      if (slot.isPast) return "past";
      if (slot.isBooked) {
        return slot.isOwnBooking ? "ownBooking" : "booked";
      }

      if (slot.time >= "12:00" && slot.time < "13:00") {
        return "unavailable";
      }
      return "unavailable";
    }
    return "available";
  };

  const getSlotHoverMessage = (slot: TimeSlot) => {
    if (!hasSelection) {
      return "Please select a service or package first";
    }

    const status = getSlotStatus(slot);
    const isForbidden = isSlotForbidden(slot);

    if (status === "past") {
      return "This time slot has already passed";
    }

    if (status === "booked") {
      return "This time slot is already booked";
    }

    if (status === "ownBooking") {
      return "Your booking - click to view details";
    }

    if (status === "unavailable") {
      return "Lunch break (12:00-13:00) - not available for booking";
    }

    if (isForbidden && status === "available") {
      if (requiredSlots > 1) {
        const allSlots = slots;
        const slotIndex = allSlots.findIndex((s) => s.id === slot.id);

        if (slotIndex !== -1) {
          for (let i = 0; i < requiredSlots; i++) {
            const checkSlotIndex = slotIndex + i;
            if (checkSlotIndex >= allSlots.length) {
              return `Not enough consecutive slots available starting from this time. Need ${requiredSlots} slots.`;
            }

            const checkSlot = allSlots[checkSlotIndex];
            if (!checkSlot.isAvailable) {
              if (checkSlot.isPast) {
                return `Not enough consecutive slots available starting from this time. Need ${requiredSlots} slots.`;
              } else {
                return `Cannot book at this time - it would overlap with lunch break. Need ${requiredSlots} consecutive slots.`;
              }
            }
          }
        }
      }
      return `Invalid time selection - cannot book ${requiredSlots} consecutive slots starting from this time`;
    }

    return null;
  };

  const isSlotForbidden = (slot: TimeSlot) => {
    const status = getSlotStatus(slot);

    if (status === "past" || status === "unavailable") {
      return true;
    }

    if (requiredSlots > 1) {
      const allSlots = slots;
      const slotIndex = allSlots.findIndex((s) => s.id === slot.id);

      if (slotIndex !== -1) {
        for (let i = 0; i < requiredSlots; i++) {
          const checkSlotIndex = slotIndex + i;
          if (checkSlotIndex >= allSlots.length) {
            return true;
          }

          const checkSlot = allSlots[checkSlotIndex];
          if (!checkSlot.isAvailable) {
            return true;
          }
        }
      }
    }

    return false;
  };

  const getSlotVariant = (slot: TimeSlot) => {
    const status = getSlotStatus(slot);

    switch (status) {
      case "selected":
        return "default";
      case "available":
        return "outline";
      case "unavailable":
      case "past":
      default:
        return "outline";
    }
  };

  const getSlotClassName = (slot: TimeSlot) => {
    const status = getSlotStatus(slot);
    const isForbidden = isSlotForbidden(slot);

    return cn("h-12 text-sm font-medium transition-all duration-200", {
      "border-blue-500 bg-blue-500 text-white ring-2 ring-blue-200 hover:scale-105 focus:scale-105":
        status === "selected",

      "border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer hover:scale-105 focus:scale-105":
        status === "available" && !isForbidden && hasSelection,

      "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed":
        status === "available" && !isForbidden && !hasSelection,

      "border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed line-through":
        status === "past",

      "border-purple-200 bg-purple-50 text-purple-600 cursor-not-allowed":
        status === "booked",

      "border-green-500 bg-green-100 text-green-700 cursor-pointer hover:bg-green-200 hover:scale-105 focus:scale-105":
        status === "ownBooking",

      "border-red-200 bg-red-50 text-red-600 cursor-not-allowed":
        status === "unavailable",

      "border-yellow-200 bg-yellow-50 text-yellow-700 cursor-not-allowed":
        isForbidden && status === "available",
    });
  };

  return (
    <div className="space-y-4">
      {/* Selection Status */}
      <div className="text-center">
        <p
          className={`text-sm ${selectedSlots.length > 0 ? "text-green-600 font-medium" : "text-gray-600"}`}
        >
          {!hasSelection
            ? "Please select a service or package first to choose a time slot"
            : selectedSlots.length > 0
              ? requiredSlots === 1
                ? `✓ Great! You selected 1 slot for ${selection.roundedDurationMin} minutes`
                : `✓ Great! You selected ${selectedSlots.length} of ${requiredSlots} consecutive slots for ${selection.roundedDurationMin} minutes`
              : requiredSlots === 1
                ? `Select 1 slot for ${selection.roundedDurationMin} minutes`
                : `Click any available time to select ${requiredSlots} consecutive slots for ${selection.roundedDurationMin} minutes`}
        </p>
      </div>

      {/* Error Message */}
      {selectionError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{selectionError}</p>
        </div>
      )}

      {/* Hover Tooltip - Only for forbidden slots */}
      {hoveredSlot &&
        (() => {
          const slot = slots.find((s) => s.id === hoveredSlot);
          const message = slot ? getSlotHoverMessage(slot) : null;
          return message ? (
            <div
              className="fixed z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none"
              style={{
                left: `${mousePosition.x + 10}px`,
                top: `${mousePosition.y - 40}px`,
              }}
            >
              {message}
            </div>
          ) : null;
        })()}

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {slots.map((slot) => {
          const status = getSlotStatus(slot);
          const isForbidden = isSlotForbidden(slot);
          const isClickable =
            status !== "past" &&
            (status === "ownBooking" ||
              (hasSelection &&
                ((status === "available" && !isForbidden) ||
                  status === "selected")));

          return (
            <Button
              key={slot.id}
              variant={getSlotVariant(slot)}
              className={getSlotClassName(slot)}
              onClick={() => handleSlotClick(slot)}
              onKeyDown={(e) => handleKeyDown(e, slot)}
              onMouseEnter={(e) => {
                setHoveredSlot(slot.id);
                setMousePosition({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => {
                setMousePosition({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredSlot(null)}
              disabled={!isClickable}
              aria-pressed={status === "selected"}
              aria-disabled={!isClickable}
              aria-label={`${slot.displayTime}${
                status === "past"
                  ? " (past)"
                  : status === "unavailable"
                    ? " (lunch break)"
                    : status === "booked"
                      ? " (booked)"
                      : status === "ownBooking"
                        ? " (your booking)"
                        : status === "selected"
                          ? " (selected)"
                          : ""
              }`}
            >
              <span className="truncate">{slot.displayTime}</span>
            </Button>
          );
        })}
      </div>

      {/* Helper Text */}
      <div className="text-center text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <p className="font-medium mb-1">
          {requiredSlots === 1
            ? "Click any available time to book"
            : `Click any available time to select ${requiredSlots} consecutive slots`}
        </p>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded line-through"></div>
            <span>Past</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-50 border border-purple-200 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-500 rounded"></div>
            <span>Your Booking</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
            <span>Lunch Break</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-50 border border-yellow-200 rounded"></div>
            <span>Invalid Time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
