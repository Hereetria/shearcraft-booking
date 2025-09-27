import Image from "next/image";
import { Card } from "@/components/ui/card";

const StorySection = () => {
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-16 md:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Founded in 2012, ShearCraft began as a small neighborhood barbershop
              with a simple mission: to provide exceptional grooming services in a
              welcoming, professional environment.
            </p>
            <p>
              Over the years, we&apos;ve grown from a single chair to multiple
              locations, but our commitment to quality and customer satisfaction has
              never wavered. We believe that a great haircut is more than just a
              service—it&apos;s an experience that boosts confidence and leaves you
              feeling your best.
            </p>
            <p>
              Today, we&apos;re proud to serve thousands of clients with our
              signature blend of traditional barbering techniques and modern
              convenience, including our easy-to-use online booking system.
            </p>
          </div>
        </div>
        <div className="relative">
          <Card className="overflow-hidden shadow-lg ring-1 ring-slate-200/60">
            <div className="relative aspect-video">
              <Image
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70"
                alt="Barber at work"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#B91C1C]/20 to-[#2563EB]/20" />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
