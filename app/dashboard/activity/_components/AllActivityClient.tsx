"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  User,
  Settings,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "booking" | "user" | "service" | "package";
  action: "created" | "updated" | "deleted" | "approved" | "cancelled" | "expired";
  description: string;
  timestamp: string;
  user?: string;
  details?: string;
  servicesData?: unknown;
}

interface BookingData {
  id: string;
  status: string;
  updatedAt?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  } | null;
  package?: {
    id: string;
    name: string;
    duration: number;
    price: number;
    services: Array<{
      id: string;
      name: string;
      duration: number;
      price: number;
    }>;
  } | null;
  services?: unknown;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isTrusted: boolean;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ServiceData {
  id: string;
  name: string;
  duration: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface PackageData {
  id: string;
  name: string;
  price: number;
  duration: number;
  services: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AllActivityClient() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  const formatServicesList = useCallback(
    (services: unknown, activityId?: string): string => {
      if (!services || typeof services !== "object") return "Custom";

      if (Array.isArray(services)) {
        if (services.length === 0) return "Custom";
        if (services.length === 1) return services[0].name || "Custom Service";
        if (services.length === 2)
          return `${services[0].name || "Service 1"}, ${services[1].name || "Service 2"}`;

        if (activityId && expandedServices.has(activityId)) {
          return services
            .map((s: { name?: string }) => s.name || "Service")
            .join(", ");
        }

        return `${services[0].name || "Service 1"}, ${services[1].name || "Service 2"}...`;
      }

      return "Custom";
    },
    [expandedServices]
  );

  const toggleServicesExpansion = (activityId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setExpandedServices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(activityId)) {
        newSet.delete(activityId);
      } else {
        newSet.add(activityId);
      }
      return newSet;
    });
  };

  const fetchAllActivity = useCallback(async () => {
    try {
      setIsLoading(true);

      let bookingsResponse, usersResponse, servicesResponse, packagesResponse;

      try {
        [bookingsResponse, usersResponse, servicesResponse, packagesResponse] =
          await Promise.all([
            fetch("/api/admin/bookings"),
            fetch("/api/admin/users"),
            fetch("/api/admin/services"),
            fetch("/api/admin/packages"),
          ]);
      } catch (parallelError) {
        console.error(
          "Parallel fetch failed, trying individual requests:",
          parallelError
        );

        bookingsResponse = await fetch("/api/admin/bookings");
        usersResponse = await fetch("/api/admin/users");
        servicesResponse = await fetch("/api/admin/services");
        packagesResponse = await fetch("/api/admin/packages");
      }

      const errors = [];

      if (!bookingsResponse.ok) {
        const errorText = await bookingsResponse.text();
        console.error("Bookings API error:", errorText);
        errors.push("bookings");
      }
      if (!usersResponse.ok) {
        const errorText = await usersResponse.text();
        console.error("Users API error:", errorText);
        errors.push("users");
      }
      if (!servicesResponse.ok) {
        const errorText = await servicesResponse.text();
        console.error("Services API error:", errorText);
        errors.push("services");
      }
      if (!packagesResponse.ok) {
        const errorText = await packagesResponse.text();
        console.error("Packages API error:", errorText);
        errors.push("packages");
      }

      if (errors.length === 4) {
        throw new Error("Failed to fetch data from all endpoints");
      }

      if (errors.length > 0) {
        console.warn("Some endpoints failed:", errors);
      }

      const bookingsData = bookingsResponse.ok
        ? ((await bookingsResponse.json()) as BookingData[])
        : [];
      const usersData = usersResponse.ok
        ? ((await usersResponse.json()) as UserData[])
        : [];
      const servicesData = servicesResponse.ok
        ? ((await servicesResponse.json()) as ServiceData[])
        : [];
      const packagesData = packagesResponse.ok
        ? ((await packagesResponse.json()) as PackageData[])
        : [];

      const allActivities: ActivityItem[] = [];

      if (bookingsData && Array.isArray(bookingsData)) {
        bookingsData.forEach((booking: BookingData) => {
          const action = booking.status.toLowerCase() as ActivityItem["action"];
          allActivities.push({
            id: `booking-${booking.id}`,
            type: "booking",
            action: action,
            description: `Booking ${booking.status.toLowerCase()}`,
            timestamp: booking.updatedAt || booking.createdAt,
            user: booking.user.name || "Unknown User",
            details: booking.service
              ? `Service: ${booking.service.name}`
              : booking.package
                ? `Package: ${booking.package.name}`
                : booking.services &&
                    typeof booking.services === "object" &&
                    booking.services !== null
                  ? `Services: ${formatServicesList(booking.services)}`
                  : "N/A",
            servicesData: booking.services,
          });
        });
      }

      if (usersData && Array.isArray(usersData)) {
        usersData.forEach((user: UserData) => {
          allActivities.push({
            id: `user-${user.id}`,
            type: "user",
            action: "created",
            description: "New user registered",
            timestamp: user.createdAt,
            user: user.name,
            details: `Role: ${user.role}`,
          });
        });
      }

      if (servicesData && Array.isArray(servicesData)) {
        servicesData.forEach((service: ServiceData) => {
          allActivities.push({
            id: `service-${service.id}`,
            type: "service",
            action: "created",
            description: "Service added",
            timestamp: service.createdAt,
            details: service.name,
          });
        });
      }

      if (packagesData && Array.isArray(packagesData)) {
        packagesData.forEach((pkg: PackageData) => {
          allActivities.push({
            id: `package-${pkg.id}`,
            type: "package",
            action: "created",
            description: "Package created",
            timestamp: pkg.createdAt,
            details: pkg.name,
          });
        });
      }

      allActivities.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setActivities(allActivities);
      setError(null);
    } catch (error) {
      console.error("Error fetching all activity:", error);
      setError("Failed to load activity data");
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, [formatServicesList]);

  useEffect(() => {
    fetchAllActivity();
  }, [fetchAllActivity]);

  const getActivityIcon = (
    type: ActivityItem["type"],
    action: ActivityItem["action"]
  ) => {
    switch (type) {
      case "booking":
        switch (action) {
          case "approved":
            return <CheckCircle className="h-4 w-4 text-green-400" />;
          case "cancelled":
            return <XCircle className="h-4 w-4 text-red-400" />;
          case "expired":
            return <AlertCircle className="h-4 w-4 text-yellow-400" />;
          default:
            return <Calendar className="h-4 w-4 text-blue-400" />;
        }
      case "user":
        return <User className="h-4 w-4 text-purple-400" />;
      case "service":
        return <Settings className="h-4 w-4 text-orange-400" />;
      case "package":
        return <Package className="h-4 w-4 text-cyan-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getActionColor = (action: ActivityItem["action"]) => {
    switch (action) {
      case "created":
        return "text-green-400";
      case "updated":
        return "text-blue-400";
      case "deleted":
        return "text-red-400";
      case "approved":
        return "text-green-400";
      case "cancelled":
        return "text-red-400";
      case "expired":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || activity.type === filterType;
    const matchesAction = filterAction === "all" || activity.action === filterAction;

    return matchesSearch && matchesType && matchesAction;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-gray-600 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">All Activity</h1>
          <p className="text-blue-200">
            Complete activity log for your booking system
          </p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setFilterAction("all");
              }}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="booking">Bookings</option>
              <option value="user">Users</option>
              <option value="service">Services</option>
              <option value="package">Packages</option>
            </select>

            {/* Action Filter */}
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
              <option value="all">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
              {filterType === "booking" && (
                <>
                  <option value="approved">Approved</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </>
              )}
            </select>

            {/* Refresh Button */}
            <Button
              onClick={fetchAllActivity}
              variant="outline"
              disabled={isLoading}
              className="text-slate-600 border-slate-600 hover:bg-slate-700"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
          {error ? (
            <div className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={fetchAllActivity}
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="p-8 text-center">
              <Clock className="h-12 w-12 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">
                {searchTerm || filterType !== "all" || filterAction !== "all"
                  ? "No activities match your filters"
                  : "No activity found"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700/50">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-6 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type, activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <p className="text-white font-medium">
                            {activity.description}
                          </p>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getActionColor(activity.action)} bg-slate-700/50`}
                          >
                            {activity.action}
                          </span>
                          <span className="text-xs text-slate-500 px-2 py-1 rounded-full bg-slate-700/30">
                            {activity.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>

                      {activity.user && (
                        <p className="text-sm text-slate-400 mt-2">
                          by {activity.user}
                        </p>
                      )}

                      {activity.details && (
                        <div className="text-sm text-slate-500 mt-1">
                          {activity.details.startsWith("Services:") &&
                          activity.servicesData ? (
                            <div className="flex items-center space-x-1">
                              <span className="truncate">
                                Services:{" "}
                                {formatServicesList(
                                  activity.servicesData,
                                  activity.id
                                )}
                              </span>
                              {activity.servicesData &&
                                Array.isArray(activity.servicesData) &&
                                activity.servicesData.length > 2 && (
                                  <Button
                                    onClick={(e) =>
                                      toggleServicesExpansion(activity.id, e)
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-400 hover:text-blue-300 ml-1 flex-shrink-0 h-auto p-1 text-xs cursor-pointer hover:bg-transparent"
                                  >
                                    {expandedServices.has(activity.id)
                                      ? "Show less"
                                      : "Show more"}
                                  </Button>
                                )}
                            </div>
                          ) : (
                            <p className="truncate">{activity.details}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {filteredActivities.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Showing {filteredActivities.length} of {activities.length} activities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
