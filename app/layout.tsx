import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import Navbar from "@/components/layout/navbar/Navbar";
import { AutoRefreshSession } from "@/components/auth/AutoRefreshSession";
import MainContentWrapper from "../components/layout/MainContentWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShearCraft Booking",
  description:
    "Modern barber booking app. Browse services and packages, pick your time, and manage reservations with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Providers>
          <Navbar />
          <MainContentWrapper>{children}</MainContentWrapper>
          <AutoRefreshSession />
        </Providers>
      </body>
    </html>
  );
}
