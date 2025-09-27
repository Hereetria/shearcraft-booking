import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/requireAuth"
import { handleError } from "@/lib/errors/errorHandler"
import { notFoundError } from "@/lib/errors/httpErrors"
import { userService } from "@/services/userService"
import { userSelfProjection } from "@/lib/projections/userProjection"

export async function GET() {
  try {
    const { user } = await requireAuth()
    const found = await userService.getByIdForSelf(user.id)

    if (!found) {
      throw notFoundError("User not found")
    }

    return NextResponse.json(userSelfProjection(found), { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}
