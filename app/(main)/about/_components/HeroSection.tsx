import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative mx-auto max-w-screen-xl px-4 py-16 md:px-6 lg:px-8">
      <div className="relative rounded-2xl overflow-hidden aspect-video">
        <Image
          src="https://images.unsplash.com/photo-1517832606299-7ae9b720a186"
          alt="Professional barbershop interior"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">About ShearCraft</h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8 text-white/90">
            We&apos;ve been crafting exceptional grooming experiences for over a
            decade, combining traditional barbering techniques with modern
            convenience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-[#B91C1C] text-white hover:bg-gradient-to-r hover:from-[#B91C1C] hover:to-[#2563EB]"
              asChild
            >
              <Link href="/reservation">Book Now</Link>
            </Button>
            <Button
              size="lg"
              className="bg-black text-white hover:bg-neutral-800 hover:scale-105 transition-all duration-200"
              asChild
            >
              <Link href="/#services">View Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
