"use client";

import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ResetPasswordContent from "./ResetPasswordContent";
import AuthBackground from "@/app/(auth)/_components/AuthBackground";
import { AuthProvider } from "@/contexts/AuthContext";
import BackToLoginLink from "@/app/reset-password/_components/BackToLoginLink";

export default function ResetPasswordPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <AuthBackground />

        <Card className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border-0 ring-1 ring-white/20 my-8">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Reset Password
            </CardTitle>
            <p className="text-gray-600 text-sm mt-2">
              Enter your new password below.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Suspense fallback={<p>Loading reset password...</p>}>
              <ResetPasswordContent />
            </Suspense>
            <BackToLoginLink />
          </CardContent>
        </Card>
      </div>
    </AuthProvider>
  );
}
