"use client";

import { useEffect } from "react";
import { BookingProvider, useBooking } from "@/contexts/BookingContext";
import { Service, Package } from "@/lib/booking-utils";

interface BookingProviderWrapperProps {
  children: React.ReactNode;
  services: Service[];
  packages: Package[];
}

function BookingInitializer({
  services,
  packages,
}: {
  services: Service[];
  packages: Package[];
}) {
  const { dispatch } = useBooking();

  useEffect(() => {
    dispatch({ type: "SET_SERVICES", payload: services });
    dispatch({ type: "SET_PACKAGES", payload: packages });
  }, [dispatch, services, packages]);

  return null;
}

export default function BookingProviderWrapper({
  children,
  services,
  packages,
}: BookingProviderWrapperProps) {
  return (
    <BookingProvider>
      <BookingInitializer services={services} packages={packages} />
      {children}
    </BookingProvider>
  );
}
