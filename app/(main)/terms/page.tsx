import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthBackground from "@/app/(auth)/_components/AuthBackground";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

export const dynamic = "force-static";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border-0 ring-1 ring-white/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Terms of Service
              </CardTitle>
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>

            <CardContent className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Acceptance of Terms
                </h2>
                <p className="leading-relaxed">
                  By accessing and using ShearCraft Booking services, you accept and
                  agree to be bound by the terms and provision of this agreement. If
                  you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  2. Use License
                </h2>
                <p className="leading-relaxed mb-3">
                  Permission is granted to temporarily download one copy of
                  ShearCraft Booking materials for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a
                  transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>modify or copy the materials</li>
                  <li>
                    use the materials for any commercial purpose or for any public
                    display
                  </li>
                  <li>
                    attempt to reverse engineer any software contained on the website
                  </li>
                  <li>
                    remove any copyright or other proprietary notations from the
                    materials
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Service Availability
                </h2>
                <p className="leading-relaxed">
                  ShearCraft Booking reserves the right to modify, suspend, or
                  discontinue the service (or any part thereof) temporarily or
                  permanently at any time and from time to time with or without
                  notice. You agree that ShearCraft Booking shall not be liable to
                  you or to any third party for any modification, suspension, or
                  discontinuance of the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Booking and Cancellation Policy
                </h2>
                <p className="leading-relaxed mb-3">
                  All bookings are subject to availability and confirmation. We
                  reserve the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Cancel or reschedule appointments due to unforeseen circumstances
                  </li>
                  <li>Require a minimum notice period for cancellations</li>
                  <li>Apply cancellation fees as outlined in our booking policy</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  5. User Responsibilities
                </h2>
                <p className="leading-relaxed">
                  You are responsible for maintaining the confidentiality of your
                  account and password and for restricting access to your computer.
                  You agree to accept responsibility for all activities that occur
                  under your account or password.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  6. Limitation of Liability
                </h2>
                <p className="leading-relaxed">
                  In no event shall ShearCraft Booking, nor its directors, employees,
                  partners, agents, suppliers, or affiliates, be liable for any
                  indirect, incidental, special, consequential, or punitive damages,
                  including without limitation, loss of profits, data, use, goodwill,
                  or other intangible losses, resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  7. Governing Law
                </h2>
                <p className="leading-relaxed">
                  These terms and conditions are governed by and construed in
                  accordance with the laws and you irrevocably submit to the
                  exclusive jurisdiction of the courts in that state or location.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  8. Changes to Terms
                </h2>
                <p className="leading-relaxed">
                  ShearCraft Booking reserves the right, at its sole discretion, to
                  modify or replace these Terms of Service at any time. If a revision
                  is material, we will try to provide at least 30 days notice prior
                  to any new terms taking effect.
                </p>
              </section>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  If you have any questions about these Terms of Service, please
                  contact us at{" "}
                  <a
                    href="mailto:legal@shearcraft.com"
                    className="text-[#2563EB] hover:underline"
                  >
                    legal@shearcraft.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
