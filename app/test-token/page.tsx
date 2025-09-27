"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Clock, Key, Shield } from "lucide-react";

interface TokenData {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessTokenExpires?: string;
  sessionExpires?: string;
  refreshTokenExpires?: string;
  refreshToken?: string;
  error?: string;
}

export default function TestTokenPage() {
  const { data: session, status } = useSession();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    accessToken: string;
    refreshToken: string;
  }>({
    accessToken: "Calculating...",
    refreshToken: "Calculating...",
  });

  const fetchTokenData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-token");
      const data = await response.json();
      setTokenData(data);
    } catch (error) {
      console.error("Error fetching token data:", error);
      setTokenData({
        success: false,
        error: "Failed to fetch token data",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (expiresAt: string | undefined) => {
    if (!expiresAt) return "No expiration data";

    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const diff = expires - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  useEffect(() => {
    if (session) {
      fetchTokenData();
    }
  }, [session]);

  useEffect(() => {
    if (tokenData?.success) {
      const interval = setInterval(() => {
        setTimeLeft({
          accessToken: calculateTimeLeft(tokenData.accessTokenExpires),
          refreshToken: calculateTimeLeft(tokenData.refreshTokenExpires),
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tokenData]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-400">
              Not Authenticated
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300">Please log in to view token information.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="p-4 pt-20 md:pt-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Token Test Page
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Monitor your access and refresh tokens in real-time
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {/* User Information */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Shield className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {tokenData?.user ? (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-400 text-sm">Name:</span>
                      <span className="text-white text-sm sm:text-base break-words">
                        {tokenData.user.name}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-400 text-sm">Email:</span>
                      <span className="text-white text-sm sm:text-base break-all">
                        {tokenData.user.email}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-gray-400 text-sm">Role:</span>
                      <span className="text-white text-sm sm:text-base">
                        {tokenData.user.role}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No user data available</p>
                )}
              </CardContent>
            </Card>

            {/* Token Status */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                  <Key className="h-5 w-5" />
                  Token Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Access Token</span>
                    </div>
                    <div className="text-white font-mono text-xs sm:text-sm bg-slate-900/50 p-3 rounded border border-slate-600/50">
                      {timeLeft.accessToken}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <RefreshCw className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Refresh Token</span>
                    </div>
                    <div className="text-white font-mono text-xs sm:text-sm bg-slate-900/50 p-3 rounded border border-slate-600/50">
                      {timeLeft.refreshToken}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Raw Token Data - Full Width */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-white">
                  <span className="flex items-center gap-2 text-lg">
                    <Key className="h-5 w-5" />
                    Raw Token Data
                  </span>
                  <Button
                    onClick={fetchTokenData}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2 h-auto w-full sm:w-auto"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-slate-900/50 p-3 md:p-4 rounded border border-slate-600/50 overflow-auto max-h-96">
                  <pre className="text-gray-300 text-xs sm:text-sm whitespace-pre-wrap break-words">
                    {JSON.stringify(tokenData, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
