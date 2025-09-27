"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import DashboardOverview from "./DashboardOverview";
import AdminSidebar from "./AdminSidebar";
import BookingsManagement from "./BookingsManagement";
import UsersManagement from "./UsersManagement";
import ServicesManagement from "./ServicesManagement";
import PackagesManagement from "./PackagesManagement";

type AdminSection = "overview" | "bookings" | "users" | "services" | "packages";

export default function AdminDashboardClient() {
  const { data: session } = useSession();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [isLoading, setIsLoading] = useState(true);
  // Sidebar state is now managed globally via context

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex">
        {/* Sidebar - Always render to prevent white flash */}
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        {/* Loading content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />;
      case "bookings":
        return <BookingsManagement />;
      case "users":
        return <UsersManagement />;
      case "services":
        return <ServicesManagement />;
      case "packages":
        return <PackagesManagement />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-blue-200 text-sm md:text-base">
                    Welcome back, {session?.user?.name || "Admin"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
