import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar/Navbar";
import { Home, Scissors } from "lucide-react";
import BackButton from "@/components/common/BackButton";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border-0 ring-1 ring-white/20">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Scissors className="h-10 w-10 text-red-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-2">
                404
              </CardTitle>
              <p className="text-xl text-gray-600 mb-2">Page Not Found</p>
              <p className="text-gray-500">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
              </p>
            </CardHeader>

            <CardContent className="space-y-6 text-center pb-8">
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  The page you&apos;re looking for might have been moved, deleted, or
                  doesn&apos;t exist. Don&apos;t worry though - our barber services
                  are still available!
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> Try checking the URL for typos, or use the
                    navigation menu to find what you&apos;re looking for.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  className="bg-black text-white hover:bg-neutral-800 transition-all font-semibold"
                >
                  <Link href="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Go Home
                  </Link>
                </Button>

                <BackButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
