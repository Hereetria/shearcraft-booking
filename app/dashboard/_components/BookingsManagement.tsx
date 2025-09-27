"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DemoModeTooltip from "./DemoModeTooltip";
import { useSidebar } from "@/contexts/SidebarContext";

interface Booking {
  id: string;
  dateTime: string;
  status: "PENDING" | "APPROVED" | "CANCELLED" | "EXPIRED";
  duration: number;
  user: {
    id: string;
    name: string;
    email: string;
  };
  service?: {
    id: string;
    name: string;
  };
  package?: {
    id: string;
    name: string;
  };
  services?: unknown;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsManagement() {
  const { isSidebarCollapsed } = useSidebar();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());
  const [windowWidth, setWindowWidth] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowMobileLayout = () => {
    if (typeof window === "undefined") return false;

    const currentWidth = windowWidth || window.innerWidth;
    const breakpoint = isSidebarCollapsed ? 1138 : 1331;
    return currentWidth < breakpoint;
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />;
      case "EXPIRED":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "APPROVED":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "CANCELLED":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "EXPIRED":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const formatServicesList = (services: unknown, bookingId?: string): string => {
    if (!services || typeof services !== "object") return "Custom";

    if (Array.isArray(services)) {
      if (services.length === 0) return "Custom";
      if (services.length === 1)
        return String(services[0]?.name || "Custom Service");
      if (services.length === 2) {
        return `${String(services[0]?.name || "Service 1")}, ${String(services[1]?.name || "Service 2")}`;
      }

      if (bookingId && expandedServices.has(bookingId)) {
        return services
          .map((s: { name?: string }) => String(s?.name || "Service"))
          .join(", ");
      }

      return `${String(services[0]?.name || "Service 1")}, ${String(services[1]?.name || "Service 2")}...`;
    }

    if (Object.keys(services as object).length === 0) return "Custom";

    return "Custom";
  };

  const filteredBookings = bookings
    .filter((booking) => {
      if (!searchTerm.trim()) {
        const matchesStatus =
          statusFilter === "all" || booking.status === statusFilter;
        return matchesStatus;
      }

      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch =
        booking.user.name.toLowerCase().includes(searchLower) ||
        booking.user.email.toLowerCase().includes(searchLower) ||
        booking.service?.name.toLowerCase().includes(searchLower) ||
        booking.package?.name.toLowerCase().includes(searchLower) ||
        (booking.services &&
          formatServicesList(booking.services)
            .toLowerCase()
            .includes(searchLower)) ||
        booking.id.toLowerCase().includes(searchLower) ||
        booking.status.toLowerCase().includes(searchLower) ||
        new Date(booking.dateTime)
          .toLocaleDateString()
          .toLowerCase()
          .includes(searchLower) ||
        booking.duration.toString().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const statusOrder = { PENDING: 1, APPROVED: 2, EXPIRED: 3, CANCELLED: 4 };
      const aOrder = statusOrder[a.status as keyof typeof statusOrder] || 5;
      const bOrder = statusOrder[b.status as keyof typeof statusOrder] || 5;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const toggleServicesExpansion = (bookingId: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setExpandedServices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
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
        <h2 className="text-2xl font-bold text-white">Bookings Management</h2>
        <div className="flex items-center space-x-4">
          <DemoModeTooltip action="export">
            <Button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Export
            </Button>
          </DemoModeTooltip>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, service, booking ID, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer hover:bg-slate-600/50 hover:border-slate-500/50 active:bg-slate-600/70 transition-colors duration-200"
              style={{ cursor: "pointer" }}
            >
              <option
                value="all"
                className="cursor-pointer bg-slate-700 text-white hover:bg-slate-600"
                style={{ cursor: "pointer" }}
              >
                All Status
              </option>
              <option
                value="PENDING"
                className="cursor-pointer bg-slate-700 text-white hover:bg-slate-600"
                style={{ cursor: "pointer" }}
              >
                Pending
              </option>
              <option
                value="APPROVED"
                className="cursor-pointer bg-slate-700 text-white hover:bg-slate-600"
                style={{ cursor: "pointer" }}
              >
                Approved
              </option>
              <option
                value="EXPIRED"
                className="cursor-pointer bg-slate-700 text-white hover:bg-slate-600"
                style={{ cursor: "pointer" }}
              >
                Expired
              </option>
              <option
                value="CANCELLED"
                className="cursor-pointer bg-slate-700 text-white hover:bg-slate-600"
                style={{ cursor: "pointer" }}
              >
                Cancelled
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table - Desktop */}
      {!shouldShowMobileLayout() && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Service/Package
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {paginatedBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {booking.user.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          {booking.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {booking.service?.name ||
                          booking.package?.name ||
                          (booking.services &&
                          (Array.isArray(booking.services)
                            ? booking.services.length > 0
                            : Object.keys(booking.services).length > 0)
                            ? formatServicesList(booking.services)
                            : "Incomplete Booking")}
                      </div>
                      <div className="text-xs text-slate-400">
                        {booking.service
                          ? "Service"
                          : booking.package
                            ? "Package"
                            : booking.services &&
                                (Array.isArray(booking.services)
                                  ? booking.services.length > 0
                                  : Object.keys(booking.services).length > 0)
                              ? "Services"
                              : "Missing Data"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {formatDateTime(booking.dateTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {formatDuration(booking.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="ml-1">{booking.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => setSelectedBooking(booking)}
                          variant="ghost"
                          size="icon"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DemoModeTooltip action="edit">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DemoModeTooltip>
                        <DemoModeTooltip action="delete">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DemoModeTooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Cards - Mobile/Tablet */}
      {shouldShowMobileLayout() && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:bg-slate-700/30 transition-colors"
            >
              {/* Header with Status and Actions */}
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                >
                  {getStatusIcon(booking.status)}
                  <span className="ml-1">{booking.status}</span>
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={() => setSelectedBooking(booking)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DemoModeTooltip action="edit">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DemoModeTooltip>
                  <DemoModeTooltip action="delete">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DemoModeTooltip>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-3">
                <div className="text-sm font-medium text-white">
                  {booking.user.name}
                </div>
                <div className="text-xs text-slate-400">{booking.user.email}</div>
              </div>

              {/* Service/Package Info */}
              <div className="mb-3">
                <div className="text-sm text-white">
                  {booking.service?.name ||
                    booking.package?.name ||
                    (booking.services &&
                    (Array.isArray(booking.services)
                      ? booking.services.length > 0
                      : Object.keys(booking.services).length > 0)
                      ? formatServicesList(booking.services)
                      : "Incomplete Booking")}
                </div>
                <div className="text-xs text-slate-400">
                  {booking.service
                    ? "Service"
                    : booking.package
                      ? "Package"
                      : booking.services &&
                          (Array.isArray(booking.services)
                            ? booking.services.length > 0
                            : Object.keys(booking.services).length > 0)
                        ? "Services"
                        : "Missing Data"}
                </div>
              </div>

              {/* Date, Time and Duration */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-400 mb-1">Date & Time</div>
                  <div className="text-slate-300">
                    {formatDateTime(booking.dateTime)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Duration</div>
                  <div className="text-slate-300">
                    {formatDuration(booking.duration)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <div
            className={`flex ${shouldShowMobileLayout() ? "flex-col" : "flex-row"} items-center justify-between gap-4`}
          >
            <div
              className={`text-sm text-slate-400 ${shouldShowMobileLayout() ? "text-center" : "text-left"}`}
            >
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredBookings.length)} of{" "}
              {filteredBookings.length} bookings
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="text-slate-400 border-slate-600 hover:bg-slate-700 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    className={`w-8 h-8 p-0 ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-600 hover:bg-slate-700 disabled:opacity-50"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 sm:ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`bg-slate-800 rounded-xl ${shouldShowMobileLayout() ? "p-4" : "p-6"} max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Booking Details</h3>
              <Button
                onClick={() => setSelectedBooking(null)}
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <XCircle className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-4">
              <div
                className={`grid ${shouldShowMobileLayout() ? "grid-cols-1" : "grid-cols-2"} gap-4`}
              >
                <div>
                  <label className="text-sm text-slate-400">Customer</label>
                  <p className="text-white font-medium">
                    {selectedBooking.user.name}
                  </p>
                  <p className="text-slate-300 text-sm">
                    {selectedBooking.user.email}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-slate-400">Status</label>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedBooking.status)}`}
                    >
                      {getStatusIcon(selectedBooking.status)}
                      <span className="ml-2">{selectedBooking.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`grid ${shouldShowMobileLayout() ? "grid-cols-1" : "grid-cols-2"} gap-4`}
              >
                <div>
                  <label className="text-sm text-slate-400">Date & Time</label>
                  <p className="text-white">
                    {formatDateTime(selectedBooking.dateTime)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Duration</label>
                  <p className="text-white">
                    {formatDuration(selectedBooking.duration)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-400">Service/Package</label>
                <div className="text-white">
                  <span>
                    {selectedBooking.service?.name ||
                      selectedBooking.package?.name ||
                      (selectedBooking.services &&
                      (Array.isArray(selectedBooking.services)
                        ? selectedBooking.services.length > 0
                        : Object.keys(selectedBooking.services).length > 0)
                        ? (formatServicesList(
                            selectedBooking.services,
                            selectedBooking.id
                          ) as string)
                        : "Incomplete Booking")}
                  </span>
                  {Boolean(
                    selectedBooking.services &&
                      Array.isArray(selectedBooking.services) &&
                      selectedBooking.services.length > 2
                  ) && (
                    <Button
                      onClick={(e) => toggleServicesExpansion(selectedBooking.id, e)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 ml-1 flex-shrink-0 h-auto p-1 text-xs cursor-pointer hover:bg-transparent"
                    >
                      {expandedServices.has(selectedBooking.id)
                        ? "Show less"
                        : "Show more"}
                    </Button>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedBooking.service
                    ? "Service"
                    : selectedBooking.package
                      ? "Package"
                      : selectedBooking.services &&
                          (Array.isArray(selectedBooking.services)
                            ? selectedBooking.services.length > 0
                            : Object.keys(selectedBooking.services).length > 0)
                        ? "Services"
                        : "Missing Data"}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
