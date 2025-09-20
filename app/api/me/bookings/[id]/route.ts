import { NextResponse } from "next/server"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { bookingService } from "@/services/bookingService"
import { requireParam } from "@/lib/requireParam"

export const GET = withErrorHandling(
  withAuth(async (_req, { userId, params }) => {
    const result = requireParam("id", params)
    if (!result.ok) return result.response

    const booking = await bookingService.getByIdForSelf(result.value, userId)
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    return NextResponse.json(booking)
  })
)
