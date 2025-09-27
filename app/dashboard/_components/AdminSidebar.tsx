"use client";

import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Package,
  LogOut,
  Scissors,
  Menu,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth/logout";
import { useSidebar } from "@/contexts/SidebarContext";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (
    section: "overview" | "bookings" | "users" | "services" | "packages"
  ) => void;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "users", label: "Users", icon: Users },
  { id: "services", label: "Services", icon: Settings },
  { id: "packages", label: "Packages", icon: Package },
];

export default function AdminSidebar({
  activeSection,
  onSectionChange,
}: AdminSidebarProps) {
  const { data: session } = useSession();
  const { isSidebarCollapsed, isMobile, toggleSidebar, showToggleButton } =
    useSidebar();

  const handleToggle = () => {
    toggleSidebar();
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full backdrop-blur-sm border-r border-blue-500/20 shadow-2xl transition-all duration-300 ease-in-out z-50 ${
        isMobile ? "w-16" : isSidebarCollapsed ? "w-16" : "w-64"
      }`}
      style={{
        backgroundColor: "rgba(30, 41, 59, 0.98)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header Section - Fixed at top */}
        <div
          className={`transition-all duration-300 ${isSidebarCollapsed ? "p-3" : "p-6"} flex-shrink-0`}
        >
          {/* Header with Toggle */}
          <div
            className={`mb-8 mt-14 ${isSidebarCollapsed ? "flex flex-col items-center space-y-4" : "flex items-center justify-between"}`}
          >
            <div
              className={`flex items-center ${isSidebarCollapsed ? "flex-col space-y-2" : "space-x-3"} min-w-0`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Scissors className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div>
              </div>
              {!isSidebarCollapsed && (
                <div className="transition-all duration-300 min-w-0">
                  <h2 className="text-2xl font-black text-white tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text whitespace-nowrap">
                    ShearCraft
                  </h2>
                </div>
              )}
            </div>

            {!isMobile && showToggleButton && (
              <Button
                onClick={handleToggle}
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 p-2 transition-all duration-200 flex-shrink-0"
                title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="mb-8 transition-all duration-300">
              <div className="ml-11">
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider whitespace-nowrap">
                  Admin Panel
                </p>
                <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 mt-1 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area - Takes remaining space */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Navigation - Scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <nav className={`space-y-2 ${isSidebarCollapsed ? "px-1" : "px-1"}`}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <Button
                    key={item.id}
                    onClick={() => {
                      setTimeout(() => {
                        onSectionChange(
                          item.id as
                            | "overview"
                            | "bookings"
                            | "users"
                            | "services"
                            | "packages"
                        );
                      }, 50);
                    }}
                    variant="ghost"
                    className={`w-full border border-transparent transition-all duration-300 group ${
                      isSidebarCollapsed
                        ? "justify-center px-2 py-3 h-auto"
                        : "justify-start px-4 py-3 h-auto"
                    } ${
                      isActive
                        ? "bg-blue-600/20 text-blue-300 border-blue-500/30 shadow-lg hover:bg-blue-600/30 hover:border-blue-500 focus:border-blue-500"
                        : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-600 focus:border-slate-600"
                    }`}
                    title={isSidebarCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`h-5 w-5 ${isSidebarCollapsed ? "" : "mr-3"} ${isActive ? "text-blue-400" : "text-slate-400 group-hover:text-blue-400"}`}
                    />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="font-medium transition-all duration-300 whitespace-nowrap">
                          {item.label}
                        </span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                        )}
                      </>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* User Info & Logout - Fixed at bottom with mt-auto */}
          <div
            className={`mt-auto transition-all duration-300 ${isSidebarCollapsed ? "p-2" : "p-6"}`}
          >
            <div className="bg-slate-700/50 rounded-lg border border-slate-600/30 transition-all duration-300">
              {isSidebarCollapsed ? (
                <div className="p-2">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {session?.user?.name?.charAt(0) || "A"}
                    </div>
                    <Button
                      onClick={() => logout()}
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-red-400 hover:bg-red-500/10 p-2"
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {session?.user?.name?.charAt(0) || "A"}
                    </div>
                    <div className="ml-3 transition-all duration-300 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {session?.user?.name || "Admin"}
                      </p>
                      <p className="text-slate-400 text-xs">Administrator</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => logout()}
                    variant="ghost"
                    className="w-full justify-center px-3 py-2 text-slate-300 hover:text-red-400 hover:bg-red-500/10 h-auto"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
