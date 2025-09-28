import { NextRequest, NextResponse } from "next/server"
import { bookingService } from "@/services/bookingService"
import { handleError } from "@/lib/errors/errorHandler"
import { checkRateLimit } from "@/lib/rateLimit"

export async function GET(req: NextRequest) {
  try {
    const rateLimitRes = await checkRateLimit("public-availability", req, 30, { amount: 1, unit: "m" })
    if (rateLimitRes) return handleError(rateLimitRes)
      
    const slots = await bookingService.getAllForPublic()
    return NextResponse.json(slots, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}
