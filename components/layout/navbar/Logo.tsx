import Link from "next/link";
import { Scissors } from "lucide-react";

interface LogoProps {
  variant: "light" | "dark";
}

export default function Logo({ variant }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link href="/" className="flex items-center gap-2 group min-w-0 flex-shrink-0">
      <span className="relative inline-flex items-center flex-shrink-0">
        <Scissors
          className={`h-5 w-5 ${isLight ? "text-black" : "text-white"} flex-shrink-0`}
        />
        <span className="ml-1 inline-block h-2 w-2 rounded-full bg-[#facc15] shadow-[0_0_6px_rgba(250,204,21,0.7)] flex-shrink-0" />
      </span>
      <span
        className={`text-base font-semibold tracking-wide flex-shrink-0 ${
          isLight ? "text-gray-800" : "text-white"
        } group-hover:text-[#facc15] transition-colors`}
      >
        ShearCraft
      </span>
    </Link>
  );
}
