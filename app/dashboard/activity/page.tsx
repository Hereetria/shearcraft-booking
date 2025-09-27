import { AppRole } from "@/types/appRole";
import { AuthConfig } from "@/types/authConfig";
import { withAuth } from "@/lib/auth/withAuth";
import AllActivityClient from "@/app/dashboard/activity/_components/AllActivityClient";

const auth: AuthConfig = {
  required: true,
  roles: [AppRole.ADMIN],
};

async function AllActivityPage() {
  return <AllActivityClient />;
}

export default withAuth(AllActivityPage, auth);
