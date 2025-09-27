/**
 * Business rules and utility functions for reservation system
 */

export interface TimeSlot {
  id: string;
  time: string;
  displayTime: string;
  isAvailable: boolean;
  isPast: boolean;
  isBooked?: boolean;
  isOwnBooking?: boolean;
  bookingId?: string;
}

export interface ExistingBooking {
  id: string;
  dateTime: string;
  status: string;
  userId: string;
  isOwnBooking: boolean;
  duration: number;
  service?: { duration: number };
  package?: { duration: number };
}

/**
 * Check if a date is a business day (not Sunday)
 */
export function isBusinessDay(date: Date): boolean {
  return date.getDay() !== 0; 
}

/**
 * Check if a time is during lunch break
 */
export function isLunch(time: string): boolean {
  return time >= "12:00" && time < "13:00";
}

/**
 * Check if a time slot would span across lunch break
 */
export function wouldSpanLunchBreak(startTime: string, durationMinutes: number): boolean {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = startMinutes + durationMinutes;
  
  const lunchStartMinutes = 12 * 60;
  const lunchEndMinutes = 13 * 60;
  
  return startMinutes < lunchEndMinutes && endMinutes > lunchStartMinutes;
}

/**
 * Check if a time slot conflicts with existing bookings
 */
export function hasBookingConflict(
  slotTime: string,
  durationMinutes: number,
  existingBookings: ExistingBooking[],
  _date: Date
): boolean {
  const [slotHour, slotMin] = slotTime.split(":").map(Number);
  const slotStartMinutes = slotHour * 60 + slotMin;
  const slotEndMinutes = slotStartMinutes + durationMinutes;

  return existingBookings.some(booking => {
    const bookingDate = new Date(booking.dateTime);
    const bookingHour = bookingDate.getHours();
    const bookingMin = bookingDate.getMinutes();
    const bookingStartMinutes = bookingHour * 60 + bookingMin;
    
    const bookingDuration = 30;
    const bookingEndMinutes = bookingStartMinutes + bookingDuration;

    return slotStartMinutes < bookingEndMinutes && slotEndMinutes > bookingStartMinutes;
  });
}

/**
 * Get detailed conflict information for a time slot
 */
export function getBookingConflictInfo(
  slotTime: string,
  durationMinutes: number,
  existingBookings: ExistingBooking[],
  _date: Date
): { hasConflict: boolean; isOwnBooking: boolean; bookingId?: string } {
  const [slotHour, slotMin] = slotTime.split(":").map(Number);
  const slotStartMinutes = slotHour * 60 + slotMin;
  const slotEndMinutes = slotStartMinutes + durationMinutes;

  const conflictingBooking = existingBookings.find(booking => {
    const bookingDate = new Date(booking.dateTime);
    const bookingHour = bookingDate.getHours();
    const bookingMin = bookingDate.getMinutes();
    const bookingStartMinutes = bookingHour * 60 + bookingMin;
    
    const bookingDuration = 30;
    const bookingEndMinutes = bookingStartMinutes + bookingDuration;

    return slotStartMinutes < bookingEndMinutes && slotEndMinutes > bookingStartMinutes;
  });

  if (conflictingBooking) {
    return {
      hasConflict: true,
      isOwnBooking: conflictingBooking.isOwnBooking,
      bookingId: conflictingBooking.id,
    };
  }

  return {
    hasConflict: false,
    isOwnBooking: false,
  };
}

export function getBookingDuration(_booking: ExistingBooking): number {
  return 30;
}

/**
 * Check if a time slot is in the past for today
 */
export function isPastTime(time: string, date: Date): boolean {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (!isToday) return false;
  
  const [hours, minutes] = time.split(":").map(Number);
  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  
  return slotTime < now;
}

/**
 * Get business hours for a specific day
 */
export function getBusinessHours(date: Date): { start: number; end: number } {
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 0) {
    
    return { start: 0, end: 0 };
  } else if (dayOfWeek === 6) {
    
    return { start: 9, end: 17 };
  } else {
    
    return { start: 9, end: 19 };
  }
}

/**
 * Generate time slots for a given date
 */
export function generateTimeSlots(
  date: Date, 
  existingBookings: ExistingBooking[] = []
): TimeSlot[] {
  if (!isBusinessDay(date)) {
    return [];
  }

  const { start, end } = getBusinessHours(date);
  const slots: TimeSlot[] = [];
  
  for (let hour = start; hour < end; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      
      const isPast = isPastTime(timeString, date);
      const isLunchTime = isLunch(timeString);
      const conflictInfo = getBookingConflictInfo(timeString, 30, existingBookings, date);
      const displayTime = formatTime(timeString);
      
      
      slots.push({
        id: `${date.toISOString().split("T")[0]}-${timeString}`,
        time: timeString,
        displayTime,
        isAvailable: !isPast && !isLunchTime && !conflictInfo.hasConflict,
        isPast,
        isBooked: conflictInfo.hasConflict,
        isOwnBooking: conflictInfo.isOwnBooking,
        bookingId: conflictInfo.bookingId,
      });
    }
  }
  
  return slots;
}

/**
 * Format time string for display (e.g., "09:00" -> "9:00 AM")
 */
export function formatTime(time: string): string {
  const parts = time.split(":")
  if (parts.length < 2) {
    console.warn("Invalid time format passed to formatTime:", time)
    return time
  }
  const [hoursRaw, minutesRaw] = parts
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)

  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
}


/**
 * Format date for display (e.g., "Monday, January 15, 2024")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format date for short display (e.g., "Jan 15")
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Get relative date description (e.g., "Today", "Tomorrow", "Yesterday")
 */
export function getRelativeDateDescription(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return formatDateShort(date);
  }
}

