import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CtaSection = () => {
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-16 md:px-6 lg:px-8">
      <Card className="relative overflow-hidden bg-gradient-to-r from-[#B91C1C] to-[#2563EB] text-white shadow-xl ring-1 ring-white/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#B91C1C]/90 to-[#2563EB]/90" />
        <CardContent className="relative p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Next Cut?
          </h2>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Book your appointment today and experience the ShearCraft difference.
            Professional service, comfortable atmosphere, and results you&apos;ll
            love.
          </p>
          <Button
            size="lg"
            className="bg-black text-white hover:bg-neutral-800 hover:scale-105 transition-all duration-200 font-semibold"
            asChild
          >
            <Link href="/reservation">Reserve a Slot</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default CtaSection;
