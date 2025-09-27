import { AppRole } from "@/types/appRole";
import { AuthConfig } from "@/types/authConfig";
import { withAuth } from "@/lib/auth/withAuth";
import AdminDashboardClient from "@/app/dashboard/_components/AdminDashboardClient";
import { DemoTooltipProvider } from "@/contexts/DemoTooltipContext";

const auth: AuthConfig = {
  required: true,
  roles: [AppRole.ADMIN],
};

async function AdminDashboard() {
  return (
    <DemoTooltipProvider>
      <AdminDashboardClient />
    </DemoTooltipProvider>
  );
}

export default withAuth(AdminDashboard, auth);
