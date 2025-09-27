import { getServerSession } from "next-auth";
import NavbarClient from "./NavbarClient";
import { authOptions } from "@/lib/auth/auth";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-500/60">
      <NavbarClient initialSession={session} initialIsAdmin={isAdmin} />
    </nav>
  );
}
