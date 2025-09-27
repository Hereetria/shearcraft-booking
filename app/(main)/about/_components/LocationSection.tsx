import { Phone } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const LocationSection = () => {
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-16 md:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Visit Us</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Main Location</h3>
              <p className="text-gray-600">
                123 Main Street
                <br />
                Downtown District
                <br />
                City, State 12345
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Hours</h3>
              <div className="space-y-1 text-gray-600">
                <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                <p>Saturday: 9:00 AM - 5:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-gray-600">(555) 123-4567</span>
            </div>
          </div>
        </div>
        <div>
          <Card className="overflow-hidden shadow-lg ring-1 ring-slate-200/60">
            <div className="relative aspect-video">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b"
                alt="Map showing barbershop location"
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

export default LocationSection;
