import Breadcrumb from "./_components/Breadcrumb";
import HeroSection from "./_components/HeroSection";
import StatsSection from "./_components/StatsSection";
import StorySection from "./_components/StorySection";
import TeamSection from "./_components/TeamSection";
import DifferenceSection from "./_components/DifferenceSection";
import LocationSection from "./_components/LocationSection";
import CtaSection from "./_components/CtaSection";

export default function Page() {
  return (
    <div className="min-h-screen bg-zinc-50 text-gray-900">
      <Breadcrumb />
      <HeroSection />
      <StatsSection />
      <StorySection />
      <TeamSection />
      <DifferenceSection />
      <LocationSection />
      <CtaSection />
    </div>
  );
}
