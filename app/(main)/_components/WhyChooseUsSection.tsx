import { Card } from "@/components/ui/card";
import { CalendarCheck, Users, Sparkles, Shield } from "lucide-react";

type Item = {
  id: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const defaultItems: Item[] = [
  {
    id: "booking",
    title: "Easy Booking",
    desc: "Reserve in seconds with reminders.",
    icon: CalendarCheck,
  },
  {
    id: "barbers",
    title: "Pro Barbers",
    desc: "Experienced and friendly staff.",
    icon: Users,
  },
  {
    id: "packages",
    title: "Flexible Packages",
    desc: "Save with curated bundles.",
    icon: Sparkles,
  },
  {
    id: "care",
    title: "Customer Care",
    desc: "We prioritize satisfaction.",
    icon: Shield,
  },
];

export default function WhyChooseUsSection({
  items = defaultItems,
}: {
  items?: Item[];
}) {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-choose-us-heading"
      className="relative bg-slate-50 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-screen-xl px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50/80 text-red-600 px-3 py-1 text-xs font-medium ring-1 ring-red-200/60">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>What makes us different</span>
          </div>
          <h2
            id="why-choose-us-heading"
            className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            Why choose us
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400">
            A few reasons customers love ShearCraft.
          </p>
        </div>

        <div className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 items-stretch">
          {items.map((item) => (
            <FeatureCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ item }: { item: Item }) {
  const IconComponent = item.icon;
  return (
    <Card className="group relative rounded-xl border bg-white/70 backdrop-blur-md border-transparent p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-cardLg hover:ring-1 hover:ring-blue-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 h-full min-h-[112px]">
      <div
        className="absolute inset-0 rounded-xl p-[1px] pointer-events-none
                  bg-[linear-gradient(135deg,rgba(37,99,235,0.02),transparent_40%),linear-gradient(315deg,rgba(185,28,28,0.02),transparent_40%)]
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />
      <div className="relative flex items-center gap-3 h-full">
        <div>
          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            <IconComponent className="h-5 w-5" aria-hidden={true} />
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
            {item.title}
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {item.desc}
          </p>
        </div>
      </div>
    </Card>
  );
}
