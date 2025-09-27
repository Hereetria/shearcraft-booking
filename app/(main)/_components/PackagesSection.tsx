import GradientOfferCard from "@/app/(main)/_components/GradientOfferCard";
import { Sparkles } from "lucide-react";

type Package = {
  id: string;
  name: string;
  duration: number;
  price: number;
};

type PackagesSectionProps = {
  packages: Package[];
  onBook?: (id: string) => void;
};

export default function PackagesSection({ packages, onBook }: PackagesSectionProps) {
  return (
    <section
      id="packages"
      aria-labelledby="packages-heading"
      className="relative mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-16 md:py-20"
    >
      {/* top accent */}
      <div className="absolute -top-px inset-x-0 h-px bg-gradient-to-r from-slate-300/60 via-slate-300/40 to-slate-300/60 dark:from-slate-700/60 dark:via-slate-700/40 dark:to-slate-700/60" />

      {/* symmetric soft background (blue-first gradient) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl
                bg-[radial-gradient(70%_45%_at_50%_0%,rgba(37,99,235,0.06),transparent_60%),radial-gradient(70%_45%_at_50%_0%,rgba(185,28,28,0.06),transparent_68%)]"
      />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 text-[#2563EB] px-3 py-1 text-xs font-medium ring-1 ring-blue-200/60">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Best Value</span>
        </div>
        <h2
          id="packages-heading"
          className="mt-3 text-3xl md:text-4xl font-bold text-[#111827]"
        >
          Packages
        </h2>
        <p className="mt-2 text-sm md:text-base text-[#6B7280]">
          Best value bundled offers.
        </p>
      </div>

      <div className="relative mt-10 flex justify-center gap-6 flex-wrap">
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <GradientOfferCard
              id={pkg.id}
              key={pkg.id}
              title={pkg.name}
              durationText={`${pkg.duration} min`}
              price={pkg.price}
              fromColor="#2563EB33"
              toColor="#B91C1C33"
              type="package"
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No packages available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
