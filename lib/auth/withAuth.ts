import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/auth";
import { AuthConfig } from "@/types/authConfig";
import { AppRole } from "@/types/appRole";
import { JSX } from "react";

type PageHandler<P = Record<string, unknown>> = (props: P) => Promise<JSX.Element>;

export function withAuth<P>(
  handler: PageHandler<P>,
  config: AuthConfig
): PageHandler<P> {
  return (async (props: P) => {
    const session = await getServerSession(authOptions);

    if (config.required && !session) {
      redirect("/login");
    }

    if (config.roles && !config.roles.includes(session?.user.role as AppRole)) {
      redirect("/");
    }

    return handler(props);
  }) as PageHandler<P>;
}
