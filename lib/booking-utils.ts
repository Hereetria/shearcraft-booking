/**
 * Booking flow utilities for duration calculation, rounding, and validation
 */

import { isLunch, wouldSpanLunchBreak } from "./reservation-utils";

export type SelectionMode = "services" | "package";

export interface BookingSelection {
  mode: SelectionMode;
  selectedServiceIds: string[];
  selectedPackageId: string | null;
  computedDurationMin: number;
  roundedDurationMin: number;
  requiredSlots: number;
  subtotalPrice: number;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface Package {
  id: string;
  name: string;
  duration: number;
  price: number;
}

/**
 * Calculate total duration from selected services
 */
export function calculateServicesDuration(services: Service[], selectedIds: string[]): number {
  return services
    .filter(service => selectedIds.includes(service.id))
    .reduce((total, service) => total + service.duration, 0);
}

/**
 * Get package duration by ID
 */
export function getPackageDuration(packages: Package[], packageId: string): number {
  const pkg = packages.find(p => p.id === packageId);
  return pkg?.duration || 0;
}

/**
 * Round duration to nearest 30 minutes, allowing for longer durations
 */
export function roundDurationToSlots(durationMin: number): { roundedDuration: number; requiredSlots: number } {
  if (durationMin <= 0) {
    return { roundedDuration: 30, requiredSlots: 1 };
  }
  
  if (durationMin <= 30) {
    return { roundedDuration: 30, requiredSlots: 1 };
  }
  
  
  const roundedDuration = Math.ceil(durationMin / 30) * 30;
  const requiredSlots = roundedDuration / 30;
  
  return { roundedDuration, requiredSlots };
}

/**
 * Calculate subtotal price for selected services
 */
export function calculateServicesPrice(services: Service[], selectedIds: string[]): number {
  return services
    .filter(service => selectedIds.includes(service.id))
    .reduce((total, service) => total + service.price, 0);
}

/**
 * Get package price by ID
 */
export function getPackagePrice(packages: Package[], packageId: string): number {
  const pkg = packages.find(p => p.id === packageId);
  return pkg?.price || 0;
}

/**
 * Validate that selection follows XOR rule (services OR package, not both)
 */
export function validateSelectionMode(
  mode: SelectionMode,
  selectedServiceIds: string[],
  selectedPackageId: string | null
): { isValid: boolean; error?: string } {
  if (mode === "services") {
    if (selectedPackageId) {
      return { isValid: false, error: "Cannot select package when in services mode" };
    }
    if (selectedServiceIds.length === 0) {
      return { isValid: false, error: "Please select at least one service" };
    }
  } else if (mode === "package") {
    if (selectedServiceIds.length > 0) {
      return { isValid: false, error: "Cannot select services when in package mode" };
    }
    if (!selectedPackageId) {
      return { isValid: false, error: "Please select a package" };
    }
  }
  
  return { isValid: true };
}

/**
 * Create booking selection state
 */
export function createBookingSelection(
  mode: SelectionMode,
  services: Service[],
  packages: Package[],
  selectedServiceIds: string[] = [],
  selectedPackageId: string | null = null
): BookingSelection {
  const validation = validateSelectionMode(mode, selectedServiceIds, selectedPackageId);
  
  if (!validation.isValid) {
    return {
      mode,
      selectedServiceIds: [],
      selectedPackageId: null,
      computedDurationMin: 0,
      roundedDurationMin: 30,
      requiredSlots: 1,
      subtotalPrice: 0,
    };
  }

  let computedDurationMin = 0;
  let subtotalPrice = 0;

  if (mode === "services") {
    computedDurationMin = calculateServicesDuration(services, selectedServiceIds);
    subtotalPrice = calculateServicesPrice(services, selectedServiceIds);
  } else if (mode === "package" && selectedPackageId) {
    computedDurationMin = getPackageDuration(packages, selectedPackageId);
    subtotalPrice = getPackagePrice(packages, selectedPackageId);
  }

  const { roundedDuration, requiredSlots } = roundDurationToSlots(computedDurationMin);

  return {
    mode,
    selectedServiceIds,
    selectedPackageId,
    computedDurationMin,
    roundedDurationMin: roundedDuration,
    requiredSlots,
    subtotalPrice,
  };
}

/**
 * Check if a time slot can accommodate the required duration
 */
export function canAccommodateDuration(
  slotTime: string,
  requiredSlots: number,
  businessHours: { start: number; end: number },
  lunchBreak: { start: string; end: string }
): boolean {
  const [hours, minutes] = slotTime.split(":").map(Number);
  const slotStartMinutes = hours * 60 + minutes;
  const totalDurationMinutes = requiredSlots * 30;
  const slotEndMinutes = slotStartMinutes + totalDurationMinutes;
  
  
  if (slotEndMinutes > businessHours.end * 60) {
    return false;
  }
  
  
  const lunchStartMinutes = parseInt(lunchBreak.start.split(":")[0]) * 60 + parseInt(lunchBreak.start.split(":")[1]);
  const lunchEndMinutes = parseInt(lunchBreak.end.split(":")[0]) * 60 + parseInt(lunchBreak.end.split(":")[1]);
  
  
  if (slotStartMinutes < lunchEndMinutes && slotEndMinutes > lunchStartMinutes) {
    return false;
  }
  
  return true;
}

/**
 * Get available time slots that can accommodate the booking duration
 */
export function getAvailableSlotsForDuration(
  allSlots: Array<{ id: string; time: string; isAvailable: boolean }>,
  requiredSlots: number,
  businessHours: { start: number; end: number },
  _lunchBreak: { start: string; end: string } = { start: "12:00", end: "13:00" }
): Array<{ id: string; time: string; isAvailable: boolean }> {
  return allSlots.filter(slot => {
    if (!slot.isAvailable) return false;
    
    
    if (requiredSlots === 1) {
      return true;
    }
    
    
    const totalDurationMinutes = requiredSlots * 30;
    if (wouldSpanLunchBreak(slot.time, totalDurationMinutes)) {
      return false; 
    }
    
    
    const slotIndex = allSlots.findIndex(s => s.id === slot.id);
    if (slotIndex === -1) return false;
    
    
    for (let i = 0; i < requiredSlots; i++) {
      const checkSlotIndex = slotIndex + i;
      if (checkSlotIndex >= allSlots.length) {
        return false; 
      }
      
      const checkSlot = allSlots[checkSlotIndex];
      if (!checkSlot.isAvailable) {
        return false; 
      }
      
      
      if (isLunch(checkSlot.time)) {
        return false; 
      }
    }
    
    return true;
  });
}
