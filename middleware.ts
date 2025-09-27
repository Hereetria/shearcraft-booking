import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { AppRole } from "@/types/appRole";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  if (pathname.startsWith("/api/admin")) {
    if (!token || token.role !== AppRole.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
  }

  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (
    (pathname.startsWith("/reservation") || pathname.startsWith("/my-booking")) &&
    !token
  ) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
