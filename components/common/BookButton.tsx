"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BookButtonProps {
  title: string;
  buttonLabel: string;
  serviceId?: string;
  packageId?: string;
}

export default function BookButton({
  title,
  buttonLabel,
  serviceId,
  packageId,
}: BookButtonProps) {
  const buildUrl = () => {
    const params = new URLSearchParams();
    if (serviceId) {
      params.set("service", serviceId);
    }
    if (packageId) {
      params.set("package", packageId);
    }
    return `/reservation${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <Link href={buildUrl()} className="ml-auto mt-4">
      <Button
        variant="ghost"
        size="sm"
        aria-label={`Book ${title}`}
        className="relative isolate h-9 px-3 rounded-md
                   ring-1 ring-[#2563EB] text-[#2563EB] font-medium
                   transition-colors duration-200 hover:text-white
                   before:absolute before:inset-0 before:rounded-[inherit]
                   before:bg-gradient-to-r before:from-[#2563EB] before:to-[#FBBF24]
                   before:opacity-0 before:transition-opacity before:duration-200
                   hover:before:opacity-100 cursor-pointer"
      >
        <span className="relative z-10">{buttonLabel}</span>
      </Button>
    </Link>
  );
}
