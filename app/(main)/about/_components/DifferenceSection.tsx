import { Award, Shield, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const DifferenceSection = () => {
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-16 md:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          What Makes Us Different
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We&apos;re committed to providing an exceptional experience that goes
          beyond just a haircut.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <Award className="h-6 w-6" />,
            title: "Quality",
            description: "Premium tools and techniques for the best results",
          },
          {
            icon: <Shield className="h-6 w-6" />,
            title: "Cleanliness",
            description: "Sterilized equipment and sanitized stations",
          },
          {
            icon: <Clock className="h-6 w-6" />,
            title: "On-time",
            description: "Respectful of your schedule and time",
          },
          {
            icon: <Calendar className="h-6 w-6" />,
            title: "Easy Booking",
            description: "Simple online reservation system",
          },
        ].map((feature, index) => (
          <Card
            key={index}
            className="group p-6 text-center bg-white/70 backdrop-blur-md shadow-md ring-1 ring-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <CardContent className="pt-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#B91C1C]/10 text-[#B91C1C] mb-4 group-hover:bg-[#2563EB]/10 group-hover:text-[#2563EB] transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default DifferenceSection;
