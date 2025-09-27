import { NextRequest, NextResponse } from "next/server";
import { refreshTokenService } from "@/services/refreshTokenService";
import { logInfo } from "@/lib/logger";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";

export async function POST(_req: NextRequest) {
    try {
      const { user } = await requireAuth()
  
      await refreshTokenService.revokeAllUserTokens(user.id)
      logInfo("User logged out", { userId: user.id })
  
      return NextResponse.json(
        { message: "Successfully logged out", success: true },
        { status: 200 }
      )
    } catch (err) {
      return handleError(err)
    }
  }