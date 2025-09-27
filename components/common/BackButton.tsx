"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoBack}
      className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold flex items-center gap-2"
    >
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </Button>
  );
}
