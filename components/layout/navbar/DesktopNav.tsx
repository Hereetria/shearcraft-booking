import Link from "next/link";
import { SessionData } from "./types";

interface DesktopNavLinkProps {
  href: string;
  label: string;
  variant: "light" | "dark";
}

const DesktopNavLink: React.FC<DesktopNavLinkProps> = ({ href, label, variant }) => {
  const baseColor =
    variant === "dark"
      ? "text-[#f1f5f9] hover:text-[#facc15]"
      : "text-[#111827] hover:text-[#111827]";

  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${baseColor} after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:bg-[#facc15] after:transition-all hover:after:w-full`}
    >
      {label}
    </Link>
  );
};

interface DesktopNavProps {
  variant: "light" | "dark";
  session: SessionData;
}

export default function DesktopNav({ variant, session }: DesktopNavProps) {
  return (
    <div className="flex items-center gap-4 flex-shrink-0">
      <DesktopNavLink href="/about" label="About" variant={variant} />
      {session && (
        <>
          <DesktopNavLink
            href="/my-bookings"
            label="My Bookings"
            variant={variant}
          />
          <DesktopNavLink
            href="/reservation"
            label="Reservation"
            variant={variant}
          />
        </>
      )}
    </div>
  );
}
