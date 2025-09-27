"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import AuthButtons from "./AuthButtons";
import MobileNav from "./MobileNav";
import { SessionData } from "./types";

interface NavbarClientProps {
  initialSession: SessionData;
  initialIsAdmin: boolean;
}

export default function NavbarClient({
  initialSession,
  initialIsAdmin,
}: NavbarClientProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSidebarCollapsed, isMobile } = useSidebar();
  const isDesktop = useBreakpoint(700);

  const currentSession = session || initialSession;
  const isAdmin = currentSession?.user?.role === "ADMIN" || initialIsAdmin;

  const isHomePage = pathname === "/";
  const isDashboard = pathname === "/dashboard";
  const isDashboardPage =
    pathname.startsWith("/dashboard") || pathname === "/test-token";

  const variant: "light" | "dark" = isDashboardPage
    ? "dark"
    : isHomePage
      ? isScrolled
        ? "dark"
        : "light"
      : "dark";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getLeftMargin = () => {
    if (isMobile) {
      return isDashboard ? "ml-16" : "ml-0";
    }
    if (isDashboard) {
      return isSidebarCollapsed ? "ml-16" : "ml-64";
    }

    return "ml-0";
  };

  return (
    <div
      className={`relative ${isDashboard ? "transition-all duration-300 ease-in-out" : ""} ${getLeftMargin()} ${
        isHomePage
          ? isScrolled
            ? "bg-[#0f172a] border-gray-700/60 backdrop-blur shadow-lg"
            : "bg-[rgba(0,0,0,0)] border-transparent backdrop-blur-sm supports-[backdrop-filter]:backdrop-blur-sm"
          : variant === "dark"
            ? isDashboardPage
              ? "bg-gradient-to-r from-slate-800 via-slate-800 to-blue-900 border-slate-700/50 shadow-lg"
              : "bg-[#0f172a] border-gray-700/60 backdrop-blur"
            : "bg-[rgba(0,0,0,0)] border-transparent backdrop-blur-sm supports-[backdrop-filter]:backdrop-blur-sm"
      }`}
    >
      {/* Gradient background only when not scrolled on home page */}
      {isHomePage && !isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#B91C1C]/60 to-[#2563EB]/60 -z-10" />
      )}

      {/* Dashboard-specific gradient overlay */}
      {isDashboardPage && !isHomePage && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/90 via-slate-800/95 to-blue-900/90 -z-10" />
      )}

      <div
        className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6"
        data-nav-container
      >
        {/* Left: Brand + Navigation */}
        <div className="flex items-center gap-4 flex-shrink-0 min-w-[200px]">
          <Logo variant={variant} />
          {isDesktop && <DesktopNav variant={variant} session={currentSession} />}
        </div>

        {/* Far-right: CTAs (700px+) */}
        {isDesktop && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <AuthButtons
              session={currentSession}
              isAdmin={isAdmin}
              variant={variant}
            />
          </div>
        )}

        {/* Mobile menu */}
        {!isDesktop && (
          <MobileNav
            variant={variant}
            session={currentSession}
            isAdmin={isAdmin}
            isDashboard={isDashboardPage}
            isHomePage={isHomePage}
            isScrolled={isScrolled}
          />
        )}
      </div>
    </div>
  );
}
