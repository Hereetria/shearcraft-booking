"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, Scissors, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SessionData } from "./types";

interface MobileLinkProps {
  href: string;
  label: string;
  isDashboard?: boolean;
}

const MobileLink: React.FC<MobileLinkProps> = ({
  href,
  label,
  isDashboard = false,
}) => {
  return (
    <Button
      variant="ghost"
      asChild
      className={`justify-start h-10 text-base transition-colors px-2 ${
        isDashboard
          ? "text-gray-300 hover:bg-slate-700/50 hover:text-[#facc15]"
          : "text-gray-300 hover:bg-slate-700/50 hover:text-[#facc15]"
      }`}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

interface MobileNavProps {
  variant: "light" | "dark";
  session: SessionData | null;
  isAdmin: boolean;
  isDashboard?: boolean;
  isHomePage?: boolean;
  isScrolled?: boolean;
}

export default function MobileNav({
  variant,
  session,
  isAdmin,
  isDashboard = false,
  isHomePage = false,
  isScrolled = false,
}: MobileNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Open menu"
            className={`p-2 transition-all duration-300 flex-shrink-0 ${
              isHomePage
                ? "text-gray-800 hover:text-gray-800 hover:bg-gray-300/70"
                : variant === "dark"
                  ? "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  : "text-gray-800 hover:text-gray-800 hover:bg-gray-300/70"
            }`}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className={`w-80 sm:w-96 [&>button]:hidden backdrop-blur-sm ${
            isDashboard
              ? "bg-gradient-to-br from-slate-800/95 via-slate-800/95 to-blue-900/95 border-slate-700/50"
              : "bg-[#0f172a]/95 border-gray-700/60"
          }`}
        >
          {/* Dashboard-specific gradient overlay */}
          {isDashboard && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 via-slate-800/95 to-blue-900/90 -z-10" />
          )}

          <SheetHeader
            className={`border-b pb-4 relative z-10 px-2 ${
              isDashboard ? "border-slate-700/50" : "border-slate-700/50"
            }`}
          >
            <SheetTitle className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Scissors className="h-5 w-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#facc15] shadow-[0_0_6px_rgba(250,204,21,0.7)]" />
                </div>
                <span className="text-base font-semibold tracking-tight text-white">
                  ShearCraft
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 cursor-pointer transition-colors text-white hover:bg-slate-700/50 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </SheetTitle>
          </SheetHeader>

          <nav className="mt-6 grid gap-1.5 relative z-10 px-2">
            <MobileLink href="/about" label="About" isDashboard={isDashboard} />
            {session && (
              <>
                <MobileLink
                  href="/my-bookings"
                  label="My Bookings"
                  isDashboard={isDashboard}
                />
                <MobileLink
                  href="/reservation"
                  label="Reservation"
                  isDashboard={isDashboard}
                />
              </>
            )}

            <div className="my-2 h-px bg-gray-600/30 mx-2" />

            {session ? (
              <>
                {isAdmin && (
                  <MobileLink
                    href="/dashboard"
                    label="Dashboard"
                    isDashboard={isDashboard}
                  />
                )}
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="justify-start h-10 text-base font-semibold transition-all duration-200 ease-out text-gray-300 bg-slate-700/40 hover:bg-red-500/20 hover:text-red-400 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      <span className="ml-2">Logging out...</span>
                    </div>
                  ) : (
                    "Logout"
                  )}
                </Button>
              </>
            ) : (
              <>
                <MobileLink
                  href="/signup"
                  label="Sign Up"
                  isDashboard={isDashboard}
                />
                <MobileLink href="/login" label="Login" isDashboard={isDashboard} />
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
