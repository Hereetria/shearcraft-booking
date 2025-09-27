"use client";

import React, { useRef, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm, { LoginFormRef } from "@/components/forms/LoginForm";
import SocialAuth from "@/app/(auth)/_components/SocialAuth";
import LoginHeader from "./_components/LoginHeader";
import SignUpLink from "./_components/SignUpLink";
import DemoAccounts from "./_components/DemoAccounts";
import AuthBackground from "@/app/(auth)/_components/AuthBackground";
import { AuthProvider } from "@/contexts/AuthContext";

export default function Page() {
  const loginFormRef = useRef<LoginFormRef>(null);

  const handleDemoLogin = (email: string, password: string) => {
    if (loginFormRef.current) {
      loginFormRef.current.handleDemoLogin(email, password);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <AuthBackground />
        <Card className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border-0 ring-1 ring-white/20 my-8">
          <LoginHeader />

          <CardContent className="space-y-6">
            <Suspense fallback={<p>Loading...</p>}>
              <LoginForm ref={loginFormRef} />
              <SocialAuth />
              <SignUpLink />
              <DemoAccounts onDemoLogin={handleDemoLogin} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </AuthProvider>
  );
}
