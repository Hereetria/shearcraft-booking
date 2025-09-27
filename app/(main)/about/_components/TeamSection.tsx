import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiInstagram, SiX } from "react-icons/si";

const TeamSection = () => {
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-16 md:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our skilled barbers bring years of experience and passion to every cut,
          ensuring you leave looking and feeling your absolute best.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            name: "Marcus Johnson",
            role: "Master Barber",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
            initials: "MJ",
          },
          {
            name: "David Chen",
            role: "Senior Barber",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
            initials: "DC",
          },
          {
            name: "Antonio Rodriguez",
            role: "Barber & Stylist",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
            initials: "AR",
          },
        ].map((member, index) => (
          <Card
            key={index}
            className="group text-center p-6 shadow-md ring-1 ring-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <CardContent className="pt-6">
              <div className="h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden ring-2 ring-slate-200">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-4">{member.role}</p>
              <div className="flex justify-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <SiInstagram className="h-4 w-4" />
                  <span className="sr-only">Instagram</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer"
                >
                  <SiX className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
