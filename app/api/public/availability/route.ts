import { NextResponse } from "next/server"
import { bookingService } from "@/services/bookingService"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"

export const GET = withErrorHandling(async () => {
  const slots = await bookingService.getAllForPublic()
  return NextResponse.json(slots, { status: 200 })
})
