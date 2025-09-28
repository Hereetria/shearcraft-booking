"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DemoModeTooltip from "./DemoModeTooltip";

interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bookings: number;
  };
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: 60,
    price: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/admin/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingService
        ? `/api/admin/services/${editingService.id}`
        : "/api/admin/services";
      const method = editingService ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchServices();
        setEditingService(null);
        setFormData({ name: "", duration: 60, price: 0 });
      }
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h2 className="text-2xl font-bold text-white">Services Management</h2>
        <DemoModeTooltip action="add">
          <Button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </DemoModeTooltip>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-blue-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">{services.length}</p>
              <p className="text-slate-400 text-sm">Total Services</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-400 mr-3" />
            <div>
              <p className="text-2xl font-bold text-white">
                {Math.round(
                  services.reduce((acc, s) => acc + s.duration, 0) / services.length
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
                  services.reduce((acc, s) => acc + s.price, 0) / services.length ||
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
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <Settings className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-white">
                    {service.name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {service._count?.bookings || 0} bookings
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

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="text-white font-medium">
                  {formatDuration(service.duration)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span className="text-sm">Price</span>
                </div>
                <span className="text-white font-medium">
                  {formatPrice(service.price)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-slate-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">Created</span>
                </div>
                <span className="text-white text-sm">
                  {new Date(service.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
