import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

type TimeUnit = "s" | "m" | "h" | "d";

interface RateLimitWindow {
  amount: number;
  unit: TimeUnit;
}

export async function checkRateLimit(
    key: string,
    req: NextRequest,
    limit: number = 10,
    window: RateLimitWindow = { amount: 1, unit: "m" }
  ) {
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${window.amount} ${window.unit}`),
      analytics: true,
    })
  
    const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  
    const { success } = await ratelimit.limit(`${key}:${ip}`);
  
    if (!success) {
        return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
      }
  
    return null
  }