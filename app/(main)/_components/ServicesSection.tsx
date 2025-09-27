import { Scissors } from "lucide-react";
import GradientOfferCard from "@/app/(main)/_components/GradientOfferCard";

type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
  description?: string;
};

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-16 md:py-20"
    >
      {/* top accent */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-[#B91C1C] via-[#FBBF24] to-[#2563EB] opacity-60" />
      {/* symmetric soft background (no right bias) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-3xl
                bg-[radial-gradient(70%_45%_at_50%_0%,rgba(185,28,28,0.06),transparent_60%),radial-gradient(70%_45%_at_50%_0%,rgba(37,99,235,0.06),transparent_68%)]"
      />

      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50/80 text-[#B91C1C] px-3 py-1 text-xs font-medium ring-1 ring-rose-200/60">
          <Scissors className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Our Services</span>
        </div>
        <h2
          id="services-heading"
          className="mt-3 text-3xl md:text-4xl font-bold text-[#111827]"
        >
          Services
        </h2>
        <p className="mt-2 text-sm md:text-base text-[#6B7280]">
          Choose from our most popular options.
        </p>
      </div>

      <div className="relative mt-10 flex justify-center gap-6 flex-wrap">
        {services.length > 0 ? (
          services.map((service) => (
            <GradientOfferCard
              id={service.id}
              key={service.id}
              title={service.name}
              durationText={`${service.duration} min`}
              price={service.price}
              fromColor="#B91C1C33"
              toColor="#2563EB33"
              type="service"
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No services available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
