"use client";

import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";
import { logout } from "@/lib/auth/logout";

export function AutoRefreshSession() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessTokenExpires) return;

    const expiry = new Date(session.accessTokenExpires).getTime();

    function scheduleCheck() {
      const now = Date.now();
      const diff = expiry - now;

      if (diff <= 0) {
        (async () => {
          const newSession = await getSession();

          if (!newSession?.accessTokenExpires) {
            await logout();
          }
        })();

        return;
      }

      const MAX_TIMEOUT = 2_147_483_647;
      const CHECK_INTERVAL = 1000 * 60 * 5; // 5 minutes
      const nextCheck = Math.min(diff, CHECK_INTERVAL, MAX_TIMEOUT);

      return setTimeout(scheduleCheck, nextCheck);
    }

    const timer = scheduleCheck();
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [session, status]);

  return null;
}
