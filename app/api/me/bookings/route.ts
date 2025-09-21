import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/requireAuth"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/error"
import { bookingService } from "@/services/bookingService"
import { z } from "zod"

const bookingSchema = z.object({
  serviceId: z.uuid().optional(),
  packageId: z.uuid().optional(),
  dateTime: z.iso.datetime(),
}).refine(
  data =>
    (data.serviceId && !data.packageId) ||
    (!data.serviceId && data.packageId) ||
    (!data.serviceId && !data.packageId),
  {
    message: "Booking must have either a service OR a package, not both",
    path: ["serviceId"],
  }
).strict()

export async function GET() {
  try {
    const { user } = await requireAuth()
    const bookings = await bookingService.getAllForSelf(user.id)
    return NextResponse.json(bookings, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth()
    const body = validate(bookingSchema, await req.json())

    const booking = await bookingService.create({
      ...body,
      userId: user.id,
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
