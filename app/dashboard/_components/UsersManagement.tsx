"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Mail,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DemoModeTooltip from "./DemoModeTooltip";
import { useSidebar } from "@/contexts/SidebarContext";

interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  isTrusted: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
  };
}

export default function UsersManagement() {
  const { isSidebarCollapsed } = useSidebar();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "CUSTOMER":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTrustedColor = (isTrusted: boolean) => {
    return isTrusted
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
        <h2 className="text-2xl font-bold text-white">Users Management</h2>
        <div className="flex items-center space-x-4">
          <DemoModeTooltip action="add">
            <Button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Add User
            </Button>
          </DemoModeTooltip>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-slate-400 text-sm">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.isTrusted).length}
              </p>
              <p className="text-slate-400 text-sm">Trusted Users</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.role === "CUSTOMER").length}
              </p>
              <p className="text-slate-400 text-sm">Customers</p>
            </div>
          </div>
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
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer hover:bg-slate-600/50 hover:border-slate-500/50 active:bg-slate-600/70 transition-colors duration-200"
              style={{ cursor: "pointer" }}
            >
              <option
                value="all"
                className="cursor-pointer bg-slate-700 text-white hover:bg-slate-600"
                style={{ cursor: "pointer" }}
              >
                All Roles
              </option>
              <option
                value="CUSTOMER"
                className="cursor-pointer bg-slate-700 text-white hover:bg-slate-600"
                style={{ cursor: "pointer" }}
              >
                Customers
              </option>
              <option
                value="ADMIN"
                className="cursor-pointer bg-slate-700 text-white hover:bg-slate-600"
                style={{ cursor: "pointer" }}
              >
                Admins
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table - Desktop */}
      {!shouldShowMobileLayout() && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-slate-400 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTrustedColor(user.isTrusted)}`}
                      >
                        {user.isTrusted ? "Trusted" : "Regular"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {user._count?.bookings || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => setSelectedUser(user)}
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

      {/* Users Cards - Mobile/Tablet */}
      {shouldShowMobileLayout() && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:bg-slate-700/30 transition-colors"
            >
              {/* Header with Role/Status and Actions */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTrustedColor(user.isTrusted)}`}
                  >
                    {user.isTrusted ? "Trusted" : "Regular"}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={() => setSelectedUser(user)}
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

              {/* User Info */}
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-white">{user.name}</div>
                  <div className="text-xs text-slate-400 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-slate-400 mb-1">Bookings</div>
                  <div className="text-slate-300 font-medium">
                    {user._count?.bookings || 0}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 mb-1">Joined</div>
                  <div className="text-slate-300">{formatDate(user.createdAt)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`bg-slate-800 rounded-xl ${shouldShowMobileLayout() ? "p-4" : "p-6"} max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">User Details</h3>
              <Button
                onClick={() => setSelectedUser(null)}
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              >
                <UserX className="h-6 w-6" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">
                    {selectedUser.name}
                  </h4>
                  <p className="text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div
                className={`grid ${shouldShowMobileLayout() ? "grid-cols-1" : "grid-cols-2"} gap-4`}
              >
                <div>
                  <label className="text-sm text-slate-400 mr-2">Role</label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(selectedUser.role)}`}
                  >
                    {selectedUser.role}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mr-2">Status</label>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTrustedColor(selectedUser.isTrusted)}`}
                  >
                    {selectedUser.isTrusted ? "Trusted" : "Regular"}
                  </span>
                </div>
              </div>

              <div
                className={`grid ${shouldShowMobileLayout() ? "grid-cols-1" : "grid-cols-2"} gap-4`}
              >
                <div>
                  <label className="text-sm text-slate-400">Total Bookings</label>
                  <p className="text-white text-lg font-semibold">
                    {selectedUser._count?.bookings || 0}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Member Since</label>
                  <p className="text-white">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => setSelectedUser(null)}
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
