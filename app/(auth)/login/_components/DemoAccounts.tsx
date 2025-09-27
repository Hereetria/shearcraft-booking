"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Shield, Sparkles } from "lucide-react";
import { DEMO_ACCOUNTS, DemoAccountType } from "@/lib/demo-accounts";

interface DemoAccountsProps {
  onDemoLogin: (email: string, password: string) => void;
}

export default function DemoAccounts({ onDemoLogin }: DemoAccountsProps) {
  const handleDemoLogin = (accountType: DemoAccountType) => {
    const account = DEMO_ACCOUNTS[accountType];
    onDemoLogin(account.email, account.password);
  };

  return (
    <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-800">Demo Accounts</h3>
        </div>
        <p className="text-xs text-blue-600 mb-3">
          Try the app with these demo accounts for testing
        </p>

        <div className="grid grid-cols-1 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("CUSTOMER")}
            className="w-full justify-start gap-2 h-9 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
          >
            <User className="h-3 w-3" />
            <span>Login as Customer</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleDemoLogin("ADMIN")}
            className="w-full justify-start gap-2 h-9 text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
          >
            <Shield className="h-3 w-3" />
            <span>Login as Admin</span>
          </Button>
        </div>

        <div className="mt-2 text-xs text-blue-500">
          <p>Email: demo@customer.com | Password: demo123</p>
          <p>Email: demo@admin.com | Password: demo123</p>
        </div>
      </CardContent>
    </Card>
  );
}
