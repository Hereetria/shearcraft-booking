"use client";

import DatePicker from "./DatePicker";
import { useBooking } from "@/contexts/BookingContext";

const ReservationDatePicker = () => {
  const { state, setDate } = useBooking();
  const selectedDate = state.selectedDate || new Date();

  return <DatePicker selectedDate={selectedDate} onDateChange={setDate} />;
};

export default ReservationDatePicker;
