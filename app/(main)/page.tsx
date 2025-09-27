import { serviceService } from "@/services/serviceService";
import { packageService } from "@/services/packageService";
import Divider from "@/app/(main)/_components/Divider";
import HeroSection from "@/app/(main)/_components/HeroSection";
import PackagesSection from "@/app/(main)/_components/PackagesSection";
import ServicesSection from "@/app/(main)/_components/ServicesSection";
import WhyChooseUsSection from "@/app/(main)/_components/WhyChooseUsSection";

export default async function Page() {
  const [services, packages] = await Promise.all([
    serviceService.getAllForPublic(),
    packageService.getAllForPublic(),
  ]);

  return (
    <div className="bg-zinc-50 text-gray-900">
      <HeroSection />
      <ServicesSection services={services} />
      <Divider />
      <PackagesSection packages={packages} />
      <Divider />
      <WhyChooseUsSection />
    </div>
  );
}
