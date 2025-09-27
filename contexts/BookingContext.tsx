"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import {
  BookingSelection,
  SelectionMode,
  Service,
  Package,
  createBookingSelection,
} from "@/lib/booking-utils";
import {
  generateTimeSlots,
  isLunch,
  wouldSpanLunchBreak,
} from "@/lib/reservation-utils";

interface BookingState {
  selection: BookingSelection;
  services: Service[];
  packages: Package[];
  selectedDate: Date | null;
  selectedSlots: string[];
  selectionError: string | null;
}

type BookingAction =
  | { type: "SET_SERVICES"; payload: Service[] }
  | { type: "SET_PACKAGES"; payload: Package[] }
  | { type: "SET_SELECTION_MODE"; payload: SelectionMode }
  | { type: "TOGGLE_SERVICE"; payload: string }
  | { type: "SELECT_PACKAGE"; payload: string | null }
  | { type: "CLEAR_SELECTION" }
  | { type: "SET_DATE"; payload: Date | null }
  | { type: "TOGGLE_SLOT"; payload: string }
  | { type: "CLEAR_SLOTS" }
  | { type: "SET_SELECTION_ERROR"; payload: string | null }
  | { type: "PRESELECT_SERVICE"; payload: string }
  | { type: "PRESELECT_PACKAGE"; payload: string }
  | { type: "RESET" };

interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  switchToServicesMode: () => void;
  switchToPackageMode: () => void;
  toggleService: (serviceId: string) => void;
  selectPackage: (packageId: string | null) => void;
  clearSelection: () => void;
  setDate: (date: Date | null) => void;
  toggleSlot: (slotId: string) => void;
  clearSlots: () => void;
  preselectService: (serviceId: string) => void;
  preselectPackage: (packageId: string) => void;
  reset: () => void;
  canProceed: boolean;
}

const getTomorrow = () => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (today.getDay() === 6) {
    const monday = new Date();
    monday.setDate(today.getDate() + 2);
    return monday;
  }

  return tomorrow;
};

const initialState: BookingState = {
  selection: {
    mode: "services",
    selectedServiceIds: [],
    selectedPackageId: null,
    computedDurationMin: 0,
    roundedDurationMin: 30,
    requiredSlots: 1,
    subtotalPrice: 0,
  },
  services: [],
  packages: [],
  selectedDate: getTomorrow(),
  selectedSlots: [],
  selectionError: null,
};

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SET_SERVICES":
      return {
        ...state,
        services: action.payload,
      };

    case "SET_PACKAGES":
      return {
        ...state,
        packages: action.payload,
      };

    case "SET_SELECTION_MODE": {
      const newMode = action.payload;
      const newSelection = createBookingSelection(
        newMode,
        state.services,
        state.packages,
        newMode === "services" ? state.selection.selectedServiceIds : [],
        newMode === "package" ? state.selection.selectedPackageId : null
      );

      return {
        ...state,
        selection: newSelection,
        selectedSlots: [],
        selectionError: null,
      };
    }

    case "TOGGLE_SERVICE": {
      const serviceId = action.payload;
      const currentIds = state.selection.selectedServiceIds;
      const newServiceIds = currentIds.includes(serviceId)
        ? currentIds.filter((id) => id !== serviceId)
        : [...currentIds, serviceId];

      const newSelection = createBookingSelection(
        "services",
        state.services,
        state.packages,
        newServiceIds,
        null
      );

      return {
        ...state,
        selection: newSelection,
        selectedSlots: [],
        selectionError: null,
      };
    }

    case "SELECT_PACKAGE": {
      const packageId = action.payload;

      const newSelection = createBookingSelection(
        "package",
        state.services,
        state.packages,
        [],
        packageId
      );

      return {
        ...state,
        selection: newSelection,
        selectedSlots: [],
        selectionError: null,
      };
    }

    case "CLEAR_SELECTION": {
      const newSelection = createBookingSelection(
        state.selection.mode,
        state.services,
        state.packages,
        [],
        null
      );

      return {
        ...state,
        selection: newSelection,
        selectedSlots: [],
        selectionError: null,
      };
    }

    case "SET_DATE":
      return {
        ...state,
        selectedDate: action.payload,
        selectedSlots: [],
        selectionError: null,
      };

    case "TOGGLE_SLOT": {
      const slotId = action.payload;
      const currentSlots = state.selectedSlots;
      const requiredSlots = state.selection.requiredSlots;

      let newSlots: string[];
      let error: string | null = null;

      if (currentSlots.includes(slotId)) {
        newSlots = [];
      } else {
        if (requiredSlots === 1) {
          newSlots = [slotId];
        } else {
          const allSlots = state.selectedDate
            ? generateTimeSlots(state.selectedDate)
            : [];

          const selectedSlot = allSlots.find((slot) => slot.id === slotId);
          if (!selectedSlot || !selectedSlot.isAvailable) {
            error = "Selected slot is not available";
            newSlots = currentSlots;
          } else {
            const totalDurationMinutes = requiredSlots * 30;
            if (wouldSpanLunchBreak(selectedSlot.time, totalDurationMinutes)) {
              error = `Cannot book at this time - it would span across lunch break (12:00-13:00). Need ${requiredSlots} consecutive slots.`;
              newSlots = currentSlots;
            } else {
              const consecutiveSlots = [slotId];
              const selectedSlotIndex = allSlots.findIndex(
                (slot) => slot.id === slotId
              );

              for (let i = 1; i < requiredSlots; i++) {
                const nextSlotIndex = selectedSlotIndex + i;
                if (nextSlotIndex < allSlots.length) {
                  const nextSlot = allSlots[nextSlotIndex];

                  if (nextSlot.isAvailable && !isLunch(nextSlot.time)) {
                    consecutiveSlots.push(nextSlot.id);
                  } else {
                    if (isLunch(nextSlot.time)) {
                      error = `Cannot book at this time - it would overlap with lunch break (12:00-13:00). Need ${requiredSlots} consecutive slots.`;
                    } else {
                      error = `Not enough consecutive slots available starting from this time. Need ${requiredSlots} slots.`;
                    }
                    newSlots = currentSlots;
                    break;
                  }
                } else {
                  error = `Cannot book at this time - not enough consecutive slots available before closing time. Need ${requiredSlots} slots.`;
                  newSlots = currentSlots;
                  break;
                }
              }

              if (consecutiveSlots.length === requiredSlots) {
                newSlots = consecutiveSlots;
              } else {
                newSlots = currentSlots;
              }
            }
          }
        }
      }

      return {
        ...state,
        selectedSlots: newSlots,
        selectionError: error,
      };
    }

    case "CLEAR_SLOTS":
      return {
        ...state,
        selectedSlots: [],
        selectionError: null,
      };

    case "SET_SELECTION_ERROR":
      return {
        ...state,
        selectionError: action.payload,
      };

    case "PRESELECT_SERVICE": {
      const serviceId = action.payload;
      const newSelection = createBookingSelection(
        "services",
        state.services,
        state.packages,
        [serviceId],
        null
      );

      return {
        ...state,
        selection: newSelection,
        selectedSlots: [],
        selectionError: null,
      };
    }

    case "PRESELECT_PACKAGE": {
      const packageId = action.payload;
      const newSelection = createBookingSelection(
        "package",
        state.services,
        state.packages,
        [],
        packageId
      );

      return {
        ...state,
        selection: newSelection,
        selectedSlots: [],
        selectionError: null,
      };
    }

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const switchToServicesMode = useCallback(() => {
    dispatch({ type: "SET_SELECTION_MODE", payload: "services" });
  }, []);

  const switchToPackageMode = useCallback(() => {
    dispatch({ type: "SET_SELECTION_MODE", payload: "package" });
  }, []);

  const toggleService = useCallback((serviceId: string) => {
    dispatch({ type: "TOGGLE_SERVICE", payload: serviceId });
  }, []);

  const selectPackage = useCallback((packageId: string | null) => {
    dispatch({ type: "SELECT_PACKAGE", payload: packageId });
  }, []);

  const clearSelection = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTION" });
  }, []);

  const setDate = useCallback((date: Date | null) => {
    if (date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        return;
      }
    }
    dispatch({ type: "SET_DATE", payload: date });
  }, []);

  const toggleSlot = useCallback((slotId: string) => {
    dispatch({ type: "TOGGLE_SLOT", payload: slotId });
  }, []);

  const clearSlots = useCallback(() => {
    dispatch({ type: "CLEAR_SLOTS" });
  }, []);

  const preselectService = useCallback((serviceId: string) => {
    dispatch({ type: "PRESELECT_SERVICE", payload: serviceId });
  }, []);

  const preselectPackage = useCallback((packageId: string) => {
    dispatch({ type: "PRESELECT_PACKAGE", payload: packageId });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  const canProceed = Boolean(
    state.selectedDate &&
      state.selectedSlots.length === state.selection.requiredSlots &&
      !state.selectionError &&
      ((state.selection.mode === "services" &&
        state.selection.selectedServiceIds.length > 0) ||
        (state.selection.mode === "package" && state.selection.selectedPackageId))
  );

  const value: BookingContextType = {
    state,
    dispatch,
    switchToServicesMode,
    switchToPackageMode,
    toggleService,
    selectPackage,
    clearSelection,
    setDate,
    toggleSlot,
    clearSlots,
    preselectService,
    preselectPackage,
    reset,
    canProceed,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
