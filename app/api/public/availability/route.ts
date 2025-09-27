import { NextResponse } from "next/server"
import { bookingService } from "@/services/bookingService"
import { handleError } from "@/lib/errors/errorHandler"

export async function GET() {
  try {
    const slots = await bookingService.getAllForPublic()
    return NextResponse.json(slots, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}
