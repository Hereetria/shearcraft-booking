import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/requireAuth"
import { handleError } from "@/lib/errors/error"
import { notFoundError } from "@/lib/errors/httpErrors"
import { bookingService } from "@/services/bookingService"
import { requireParam } from "@/lib/requireParam"
import { RouteContext } from "@/types/routeTypes"

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth()
    const id = requireParam("id", await context.params)

    const booking = await bookingService.getByIdForSelf(id, user.id)
    if (!booking) {
      throw notFoundError("Booking not found")
    }

    return NextResponse.json(booking, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}