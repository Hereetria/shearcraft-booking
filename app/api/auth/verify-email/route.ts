import { NextRequest, NextResponse } from "next/server"
import { tokenService } from "@/services/tokenService"
import { handleError } from "@/lib/errors/errorHandler"
import { badRequestError, unauthorizedError } from "@/lib/errors/httpErrors"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      throw badRequestError("Verification token is required")
    }

    const userData = await tokenService.verifyToken(token)

    if (!userData) {
      throw unauthorizedError("Invalid or expired verification token")
    }

    await tokenService.markUserAsVerified(userData.userId)

    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("verified", "true")
    loginUrl.searchParams.set("email", userData.email)

    return NextResponse.redirect(loginUrl)
  } catch (err) {
    return handleError(err)
  }
}
