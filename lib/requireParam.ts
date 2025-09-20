import { NextResponse } from "next/server";

export function requireParam(
  name: string,
  params?: Record<string, string>
): { ok: true; value: string } | { ok: false; response: Response } {
  const value = params?.[name];

  if (!value) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: `Missing ${name} parameter` },
        { status: 400 }
      ),
    };
  }

  return { ok: true, value };
}
