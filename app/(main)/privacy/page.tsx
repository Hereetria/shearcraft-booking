import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar/Navbar";
import Footer from "@/components/layout/footer/Footer";

export const dynamic = "force-static";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm border-0 ring-1 ring-white/20">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Privacy Policy
              </CardTitle>
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>

            <CardContent className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  1. Information We Collect
                </h2>
                <p className="leading-relaxed mb-3">
                  We collect information you provide directly to us, such as when you
                  create an account, make a booking, or contact us for support. This
                  may include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Booking preferences and appointment history</li>
                  <li>
                    Payment information (processed securely through third-party
                    providers)
                  </li>
                  <li>Communications with our support team</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our booking services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze trends and usage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  3. Information Sharing
                </h2>
                <p className="leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except as
                  described in this policy. We may share your information in the
                  following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>
                    With service providers who assist us in operating our business
                  </li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  4. Data Security
                </h2>
                <p className="leading-relaxed">
                  We implement appropriate security measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or
                  destruction. However, no method of transmission over the internet
                  or electronic storage is 100% secure, and we cannot guarantee
                  absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  5. Cookies and Tracking
                </h2>
                <p className="leading-relaxed mb-3">
                  We use cookies and similar tracking technologies to enhance your
                  experience on our website. These technologies help us:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how you use our website</li>
                  <li>Provide personalized content and advertisements</li>
                </ul>
                <p className="leading-relaxed mt-3">
                  You can control cookie settings through your browser preferences,
                  though disabling cookies may affect the functionality of our
                  service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  6. Your Rights
                </h2>
                <p className="leading-relaxed mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your account and data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data in a portable format</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  7. Third-Party Services
                </h2>
                <p className="leading-relaxed">
                  Our service may contain links to third-party websites or services.
                  We are not responsible for the privacy practices or content of
                  these third parties. We encourage you to review the privacy
                  policies of any third-party services you use.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  8. Children&apos;s Privacy
                </h2>
                <p className="leading-relaxed">
                  Our service is not intended for children under 13 years of age. We
                  do not knowingly collect personal information from children under
                  13. If you are a parent or guardian and believe your child has
                  provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  9. Changes to This Policy
                </h2>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify
                  you of any changes by posting the new Privacy Policy on this page
                  and updating the &quot;Last updated&quot; date. We encourage you to
                  review this Privacy Policy periodically.
                </p>
              </section>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  If you have any questions about this Privacy Policy, please contact
                  us at{" "}
                  <a
                    href="mailto:privacy@shearcraft.com"
                    className="text-[#2563EB] hover:underline"
                  >
                    privacy@shearcraft.com
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
