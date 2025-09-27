import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import BookButton from "@/components/common/BookButton";

interface GradientOfferCardProps {
  id: string;
  title: string;
  durationText: string;
  price: number;
  fromColor: string;
  toColor: string;
  buttonLabel?: string;
  className?: string;
  type?: "service" | "package";
}

export default function GradientOfferCard({
  id,
  title,
  durationText,
  price,
  fromColor,
  toColor,
  buttonLabel = "Book",
  className,
  type = "service",
}: GradientOfferCardProps) {
  return (
    <Card
      className={`w-full max-w-sm group relative rounded-xl border bg-white/70 backdrop-blur-md border-transparent p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${
        className || ""
      }`}
    >
      {/* decorative gradient border */}
      <div
        className="absolute inset-0 rounded-xl p-[1px] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(135deg, ${fromColor}, transparent 40%), linear-gradient(315deg, ${toColor}, transparent 40%)`,
        }}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-[#111827]">
            {title}
          </CardTitle>
          <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-[#6B7280]">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{durationText}</span>
          </div>
          {/* price in green */}
          <p className="mt-4 text-base font-semibold text-emerald-600">${price}</p>
        </div>

        {/* link button (no client logic needed) */}
        <BookButton
          title={title}
          buttonLabel={buttonLabel}
          serviceId={type === "service" ? id : undefined}
          packageId={type === "package" ? id : undefined}
        />
      </div>
    </Card>
  );
}
