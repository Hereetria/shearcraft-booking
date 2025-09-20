import { NextResponse } from "next/server"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { userService } from "@/services/userService"

export const GET = withErrorHandling(
  withAuth(async (_req, { userId }) => {
    const user = await userService.getByIdForSelf(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json(user)
  })
)
