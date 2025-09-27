import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { refreshTokenService } from "@/services/refreshTokenService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "No session found",
        token: null
      }, { status: 401 });
    }

    // Get refresh token expiration
    let refreshTokenExpires = null;
    if (session.user?.id) {
      try {
        const userTokens = await refreshTokenService.getUserTokens(session.user.id);
        if (userTokens.length > 0) {
          refreshTokenExpires = userTokens[0].expiresAt.toISOString();
        }
      } catch (error) {
        console.error("Failed to get refresh token expiration:", error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Token test successful",
      user: {
        id: session.user?.id,
        name: session.user?.name,
        email: session.user?.email,
        role: session.user?.role
      },
      accessTokenExpires: session.accessTokenExpires || null,
      sessionExpires: session.expires,
      refreshTokenExpires: refreshTokenExpires,
      refreshToken: "Refresh token (not exposed for security)"
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      error: err instanceof Error ? err.message : "Unknown error",
      token: null
    }, { status: 500 });
  }
}
