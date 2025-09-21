"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface NavbarProps {
  brand?: React.ReactNode;
  className?: string;
}

const DesktopNavLink: React.FC<{ href: string; label: string }> = ({
  href,
  label,
}) => {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  );
};

const MobileLink: React.FC<{ href: string; label: string }> = ({ href, label }) => {
  return (
    <Button variant="ghost" asChild className="justify-start h-10 text-base">
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default function Navbar({ brand, className }: NavbarProps) {
  return (
    <nav
      className={`sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
        className ?? ""
      }`}
    >
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 md:h-16 md:px-6 lg:px-8">
        {/* Left: Brand */}
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-primary" />
            <span className="truncate text-sm font-semibold tracking-tight md:text-base">
              {brand ?? "BarberBook"}
            </span>
          </Link>
        </div>

        {/* Right: Primary links (md+) */}
        <div className="hidden items-center gap-6 md:flex">
          <DesktopNavLink href="/" label="Home" />
          <DesktopNavLink href="/reservation" label="Reservation" />
        </div>

        {/* Far-right: CTAs (md+) */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5 text-primary" />
                  <span className="text-base font-semibold tracking-tight">
                    {brand ?? "BarberBook"}
                  </span>
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-6 grid gap-1.5">
                <MobileLink href="/" label="Home" />
                <MobileLink href="/reservation" label="Reservation" />
                <div className="my-2 h-px bg-border" />
                <MobileLink href="/dashboard" label="Dashboard" />
                <MobileLink href="/sign-up" label="Sign Up" />
                <MobileLink href="/login" label="Login" />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
