"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Settings,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import RecentActivity from "./RecentActivity";

interface DashboardStats {
  totalBookings: number;
  totalUsers: number;
  totalServices: number;
  totalPackages: number;
  pendingBookings: number;
  approvedBookings: number;
  cancelledBookings: number;
  expiredBookings: number;
  todayBookings: number;
  thisWeekBookings: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalUsers: 0,
    totalServices: 0,
    totalPackages: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    cancelledBookings: 0,
    expiredBookings: 0,
    todayBookings: 0,
    thisWeekBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [bookingsRes, usersRes, servicesRes, packagesRes] = await Promise.all([
          fetch("/api/admin/bookings"),
          fetch("/api/admin/users"),
          fetch("/api/admin/services"),
          fetch("/api/admin/packages"),
        ]);

        const [bookings, users, services, packages] = await Promise.all([
          bookingsRes.json(),
          usersRes.json(),
          servicesRes.json(),
          packagesRes.json(),
        ]);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const todayBookings = bookings.filter(
          (booking: { dateTime: string; status: string }) =>
            new Date(booking.dateTime) >= today && booking.status !== "CANCELLED"
        ).length;

        const thisWeekBookings = bookings.filter(
          (booking: { dateTime: string; status: string }) =>
            new Date(booking.dateTime) >= weekAgo && booking.status !== "CANCELLED"
        ).length;

        setStats({
          totalBookings: bookings.length,
          totalUsers: users.length,
          totalServices: services.length,
          totalPackages: packages.length,
          pendingBookings: bookings.filter(
            (b: { status: string }) => b.status === "PENDING"
          ).length,
          approvedBookings: bookings.filter(
            (b: { status: string }) => b.status === "APPROVED"
          ).length,
          cancelledBookings: bookings.filter(
            (b: { status: string }) => b.status === "CANCELLED"
          ).length,
          expiredBookings: bookings.filter(
            (b: { status: string }) => b.status === "EXPIRED"
          ).length,
          todayBookings,
          thisWeekBookings,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "blue",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "green",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Active Services",
      value: stats.totalServices,
      icon: Settings,
      color: "purple",
      change: "+2",
      changeType: "positive" as const,
    },
    {
      title: "Packages",
      value: stats.totalPackages,
      icon: Package,
      color: "orange",
      change: "+1",
      changeType: "positive" as const,
    },
  ];

  const bookingStatusCards = [
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Approved",
      value: stats.approvedBookings,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Cancelled",
      value: stats.cancelledBookings,
      icon: XCircle,
      color: "red",
    },
    {
      title: "Expired",
      value: stats.expiredBookings,
      icon: AlertCircle,
      color: "gray",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-slate-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-500/20`}>
                  <Icon className={`h-6 w-6 text-${card.color}-400`} />
                </div>
                <span
                  className={`text-sm font-medium ${
                    card.changeType === "positive"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {card.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
              <p className="text-slate-400 text-sm">{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* Booking Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bookingStatusCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-500/20`}>
                  <Icon className={`h-6 w-6 text-${card.color}-400`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{card.value}</h3>
              <p className="text-slate-400 text-sm">{card.title} Bookings</p>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">
              Today&apos;s Bookings
            </h3>
          </div>
          <p className="text-3xl font-bold text-blue-400 mb-2">
            {stats.todayBookings}
          </p>
          <p className="text-slate-400 text-sm">Scheduled for today</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="flex items-center mb-4">
            <Calendar className="h-6 w-6 text-green-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">This Week</h3>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-2">
            {stats.thisWeekBookings}
          </p>
          <p className="text-slate-400 text-sm">Total bookings this week</p>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
