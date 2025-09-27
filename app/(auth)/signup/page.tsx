import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthBackground from "@/app/(auth)/_components/AuthBackground";
import SocialAuth from "@/app/(auth)/_components/SocialAuth";
import SignUpForm from "@/components/forms/SignUpForm";
import LoginLink from "./_components/LoginLink";
import SignUpHeader from "@/app/(auth)/signup/_components/SignUpHeader";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Page() {
  return (
    <AuthProvider>
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <AuthBackground />

        <Card className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border-0 ring-1 ring-white/20 my-8">
          <SignUpHeader />
          <CardContent className="space-y-6">
            <SignUpForm />
            <SocialAuth />
            <LoginLink />
          </CardContent>
        </Card>
      </div>
    </AuthProvider>
  );
}
