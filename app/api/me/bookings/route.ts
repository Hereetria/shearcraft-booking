import { NextResponse } from "next/server"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withValidation } from "@/lib/wrappers/withValidation"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { bookingService } from "@/services/bookingService"
import { z } from "zod"

const bookingSchema = z.object({
  serviceId: z.string().uuid().optional(),
  packageId: z.string().uuid().optional(),
  dateTime: z.string().datetime(),
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

export const GET = withErrorHandling(
  withAuth(async (_req, { userId }) => {
    const bookings = await bookingService.getAllForSelf(userId)
    return NextResponse.json(bookings)
  })
)

export const POST = withErrorHandling(
  withAuth(
    withValidation(bookingSchema, async (body, _req, { userId }) => {
      const booking = await bookingService.create({
        ...body,
        userId,
      })
      return NextResponse.json(booking, { status: 201 })
    })
  )
)
