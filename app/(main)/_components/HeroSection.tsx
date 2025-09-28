import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#B91C1C] to-[#2563EB] text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 lg:px-8 md:py-28 max-md:mt-2 transition-all duration-300 ease-in-out">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-white/90">
            <Scissors className="h-5 w-5" />
            <span className="text-sm font-medium">ShearCraft</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Effortless barber appointments
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-100/90 md:text-lg">
            Book in seconds, pick your barber, and get reminders. Simple, fast, and
            reliable.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              className="bg-[#B91C1C] text-white hover:bg-gradient-to-r hover:from-[#B91C1C] hover:to-[#2563EB]"
              asChild
            >
              <Link href="/reservation">Book Now</Link>
            </Button>
            <Button
              size="lg"
              className="bg-[#2563EB] text-white hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-[#B91C1C]"
              asChild
            >
              <Link href="#services">View Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
