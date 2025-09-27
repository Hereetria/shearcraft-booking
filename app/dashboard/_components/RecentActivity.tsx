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

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const toggleServicesExpansion = (activityId: string) => {
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

  const fetchRecentActivity = useCallback(async () => {
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

      const activities: ActivityItem[] = [];

      if (bookingsData && Array.isArray(bookingsData)) {
        bookingsData.forEach((booking: BookingData) => {
          const action = booking.status.toLowerCase() as ActivityItem["action"];
          activities.push({
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
                  ? `Services: ${Object.keys(booking.services).length} service(s)`
                  : "N/A",
            servicesData: booking.services,
          });
        });
      }

      if (usersData && Array.isArray(usersData)) {
        usersData.slice(0, 3).forEach((user: UserData) => {
          activities.push({
            id: `user-${user.id}`,
            type: "user",
            action: "created",
            description: "New user registered",
            timestamp: user.updatedAt || user.createdAt,
            user: user.name,
            details: `Role: ${user.role}`,
          });
        });
      }

      if (servicesData && Array.isArray(servicesData)) {
        servicesData.slice(0, 2).forEach((service: ServiceData) => {
          activities.push({
            id: `service-${service.id}`,
            type: "service",
            action: "created",
            description: "Service added",
            timestamp: service.updatedAt || service.createdAt,
            details: service.name,
          });
        });
      }

      if (packagesData && Array.isArray(packagesData)) {
        packagesData.slice(0, 2).forEach((pkg: PackageData) => {
          activities.push({
            id: `package-${pkg.id}`,
            type: "package",
            action: "created",
            description: "Package created",
            timestamp: pkg.updatedAt || pkg.createdAt,
            details: pkg.name,
          });
        });
      }

      activities.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);

        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;

        return dateB.getTime() - dateA.getTime();
      });

      setActivities(activities.slice(0, 5));

      setError(null);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      setError("Failed to load recent activity");
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentActivity();
  }, [fetchRecentActivity]);

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

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <Button
          onClick={fetchRecentActivity}
          variant="ghost"
          size="sm"
          disabled={isLoading}
          className="text-slate-400 hover:text-gray-500 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      <div className="space-y-4">
        {error ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              onClick={fetchRecentActivity}
              variant="outline"
              size="sm"
              className="text-slate-300 border-slate-600 hover:bg-slate-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 group">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type, activity.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-white truncate">
                    {activity.description}
                  </p>
                  <span
                    className={`text-xs font-medium ${getActionColor(activity.action)}`}
                  >
                    {activity.action}
                  </span>
                </div>
                {activity.user && (
                  <p className="text-xs text-slate-400 mt-1">by {activity.user}</p>
                )}
                {activity.details && (
                  <div className="text-xs text-slate-500 mt-1">
                    {activity.details.startsWith("Services:") &&
                    activity.servicesData ? (
                      <div className="flex items-center space-x-1">
                        <span className="truncate">
                          Services:{" "}
                          {formatServicesList(activity.servicesData, activity.id)}
                        </span>
                        {activity.servicesData &&
                          Array.isArray(activity.servicesData) &&
                          activity.servicesData.length > 2 && (
                            <Button
                              onClick={() => toggleServicesExpansion(activity.id)}
                              variant="link"
                              size="sm"
                              className="text-blue-400 hover:text-blue-300 ml-1 flex-shrink-0 h-auto p-1 text-xs"
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
                <p className="text-xs text-slate-500 mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <Link href="/dashboard/activity">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all activity →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
