"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useBooking } from "@/contexts/BookingContext";

export default function UrlParameterHandler() {
  const searchParams = useSearchParams();
  const { preselectService, preselectPackage } = useBooking();

  useEffect(() => {
    const serviceId = searchParams.get("service");
    const packageId = searchParams.get("package");

    if (serviceId) {
      preselectService(serviceId);
    } else if (packageId) {
      preselectPackage(packageId);
    }
  }, [searchParams, preselectService, preselectPackage]);

  return null;
}
