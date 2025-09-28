"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SessionData } from "./types";

interface LogoutButtonProps {
  variant: "light" | "dark";
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ variant: _variant }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Only reset loading state if there's an error
      setIsLoggingOut(false);
    }
    // Don't reset loading state on success - let the redirect happen
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`rounded-lg px-2 sm:px-4 py-2 font-semibold transition-all duration-200 ease-out bg-red-600/90 text-white hover:bg-red-500/90 border border-red-500/50 hover:border-red-400/50 backdrop-blur-sm text-xs sm:text-sm`}
    >
      {isLoggingOut ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span className="sr-only">Logging out...</span>
        </div>
      ) : (
        "Logout"
      )}
    </Button>
  );
};

interface AuthButtonsProps {
  session: SessionData;
  isAdmin: boolean;
  variant?: "light" | "dark";
}

export default function AuthButtons({
  session,
  isAdmin,
  variant = "dark",
}: AuthButtonsProps) {
  if (session) {
    return (
      <>
        {isAdmin && (
          <Button
            asChild
            className="rounded-lg px-2 sm:px-4 py-2 font-semibold transition-all duration-200 ease-out text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        )}
        <LogoutButton variant={variant} />
      </>
    );
  }

  return (
    <>
      <Button
        asChild
        className="rounded-md px-2 sm:px-4 font-semibold transition-all duration-200 ease-out bg-blue-600 text-white hover:bg-blue-700 text-xs sm:text-sm"
      >
        <Link href="/signup">Sign Up</Link>
      </Button>
      <Button
        asChild
        className="rounded-md px-2 sm:px-4 font-semibold transition-all duration-200 ease-out bg-gray-700 text-white hover:bg-gray-600 text-xs sm:text-sm"
      >
        <Link href="/login">Login</Link>
      </Button>
    </>
  );
}
