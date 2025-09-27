"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scissors, Package, Clock, DollarSign } from "lucide-react";
import { useBooking } from "@/contexts/BookingContext";
import { Service, Package as PackageType } from "@/lib/booking-utils";

interface ServicePackageSelectorProps {
  services: Service[];
  packages: PackageType[];
}

export default function ServicePackageSelector({
  services: _services,
  packages: _packages,
}: ServicePackageSelectorProps) {
  const {
    state,
    switchToServicesMode,
    switchToPackageMode,
    toggleService,
    selectPackage,
  } = useBooking();

  const { selection, services, packages } = state;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          Choose Services or Package
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="flex gap-2">
          <Button
            variant={selection.mode === "services" ? "default" : "outline"}
            onClick={switchToServicesMode}
            className="flex-1"
          >
            <Scissors className="h-4 w-4 mr-2" />
            Services
          </Button>
          <Button
            variant={selection.mode === "package" ? "default" : "outline"}
            onClick={switchToPackageMode}
            className="flex-1"
          >
            <Package className="h-4 w-4 mr-2" />
            Package
          </Button>
        </div>

        {/* Services Selection */}
        {selection.mode === "services" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Services</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {services.map((service) => {
                const isSelected = selection.selectedServiceIds.includes(service.id);
                return (
                  <div
                    key={service.id}
                    className={`w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{service.name}</h4>
                        {isSelected && (
                          <Badge variant="default" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration} min
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />$
                          {service.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Package Selection */}
        {selection.mode === "package" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Package</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {packages.map((pkg) => {
                const isSelected = selection.selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    className={`w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.5rem)] p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => selectPackage(isSelected ? null : pkg.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{pkg.name}</h4>
                        {isSelected && (
                          <Badge variant="default" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pkg.duration} min
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />${pkg.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
