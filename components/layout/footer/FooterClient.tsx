import FooterBrand from "./FooterBrand";
import FooterSocialLinks from "./FooterSocialLinks";
import FooterSection from "./FooterSection";
import FooterBottom from "./FooterBottom";
import { headers } from "next/headers";

export default async function FooterClient() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  const shouldHideFooter = pathname === "/login" || pathname === "/signup";
  if (shouldHideFooter) return null;

  const sections = [
    {
      title: "Services",
      links: ["Haircuts", "Beard Trim", "Styling"],
    },
    {
      title: "Packages",
      links: ["Grooming", "Deluxe", "Premium"],
    },
    {
      title: "Company",
      links: ["About", "Careers", "Press"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact", "Status"],
    },
  ];

  return (
    <footer
      className="relative bg-slate-50 border-t"
      role="contentinfo"
      aria-labelledby="footer-heading"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-slate-200/70" />
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          <FooterBrand />
          <FooterSocialLinks />
        </div>

        <div className="my-8 md:my-10 h-px bg-slate-200/60" />

        <div className="grid grid-cols-2 md:grid-cols-12 gap-6">
          {sections.map((section, index) => (
            <FooterSection key={index} title={section.title} links={section.links} />
          ))}
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
}
