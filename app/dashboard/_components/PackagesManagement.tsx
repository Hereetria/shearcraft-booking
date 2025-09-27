"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DemoModeTooltip from "./DemoModeTooltip";

interface PackageService {
  id: string;
  name: string;
  duration: number;
  price: number;
}

interface PackageData {
  id: string;
  name: string;
  price: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
  services: PackageService[];
  _count?: {
    bookings: number;
  };
}

export default function PackagesManagement() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/admin/packages");
      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleServicesExpansion = (packageId: string) => {
    setExpandedServices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Packages Management</h2>
        <DemoModeTooltip action="add">
          <Button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </DemoModeTooltip>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">{packages.length}</p>
              <p className="text-slate-400 text-sm">Total Packages</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">
                {Math.round(
                  packages.reduce((acc, p) => acc + p.duration, 0) / packages.length
                ) || 0}
                m
              </p>
              <p className="text-slate-400 text-sm">Avg Duration</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">
                {formatPrice(
                  packages.reduce((acc, p) => acc + p.price, 0) / packages.length ||
                    0
                )}
              </p>
              <p className="text-slate-400 text-sm">Avg Price</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((packageData) => (
          <div
            key={packageData.id}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Package className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-white">
                    {packageData.name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {packageData._count?.bookings || 0} bookings
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <DemoModeTooltip action="edit">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DemoModeTooltip>
                <DemoModeTooltip action="delete">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DemoModeTooltip>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="text-white font-medium">
                  {formatDuration(packageData.duration)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="text-sm">Price</span>
                </div>
                <span className="text-white font-medium">
                  {formatPrice(packageData.price)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="text-sm">Services</span>
                </div>
                <span className="text-white font-medium">
                  {packageData.services.length}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-700/50 mt-auto">
                <p className="text-xs text-slate-400 mb-2">Includes:</p>
                <div className="space-y-1 min-h-[60px]">
                  {packageData.services.length > 0 ? (
                    <>
                      {(expandedServices.has(packageData.id)
                        ? packageData.services
                        : packageData.services.slice(0, 2)
                      ).map((service) => (
                        <div key={service.id} className="text-xs text-slate-300">
                          • {service.name}
                        </div>
                      ))}
                      {packageData.services.length > 2 && (
                        <div className="mt-2">
                          <Button
                            onClick={() => toggleServicesExpansion(packageData.id)}
                            variant="link"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 p-0 h-auto text-xs"
                          >
                            {expandedServices.has(packageData.id)
                              ? "Show less"
                              : `+${packageData.services.length - 2} more`}
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-slate-400">No services</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
