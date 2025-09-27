import { Award, Users, Star, MapPin } from "lucide-react";

const StatsSection = () => {
  return (
    <section className="mx-auto max-w-screen-xl px-4 py-12 md:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-4">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
          <Award className="h-4 w-4 mr-2" />
          12+ Years in Business
        </div>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
          <Users className="h-4 w-4 mr-2" />
          5,000+ Happy Clients
        </div>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
          <Star className="h-4 w-4 mr-2" />
          4.9/5 Average Rating
        </div>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium">
          <MapPin className="h-4 w-4 mr-2" />3 Locations
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
