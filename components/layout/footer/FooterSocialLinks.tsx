"use client";

import { Instagram, Phone, MapPin } from "lucide-react";

export default function FooterSocialLinks() {
  return (
    <div className="md:col-span-6 lg:col-span-7 flex items-start justify-end">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Instagram"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur-md ring-1 ring-slate-200 text-slate-600 hover:text-rose-600 hover:ring-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition cursor-pointer"
          onClick={(e) => e.preventDefault()}
        >
          <Instagram className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Phone"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur-md ring-1 ring-slate-200 text-slate-600 hover:text-blue-600 hover:ring-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition cursor-pointer"
          onClick={(e) => e.preventDefault()}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Location"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70 backdrop-blur-md ring-1 ring-slate-200 text-slate-600 hover:text-emerald-600 hover:ring-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition cursor-pointer"
          onClick={(e) => e.preventDefault()}
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
