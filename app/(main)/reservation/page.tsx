import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import ReservationHeader from "./_components/ReservationHeader";
import ReservationContent from "./_components/ReservationContent";
import { AppRole } from "@/types/appRole";

export default async function ReservationPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const allowedRoles = [AppRole.ADMIN, AppRole.CUSTOMER];
  if (!allowedRoles.includes(session.user.role as AppRole)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReservationHeader />
      <ReservationContent />
    </div>
  );
}
