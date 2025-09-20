import { NextResponse } from "next/server"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withRole } from "@/lib/wrappers/withRole"
import { withValidation } from "@/lib/wrappers/withValidation"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { bookingService } from "@/services/bookingService"
import { z } from "zod"
import { Role } from "@prisma/client"

const createBookingSchema = z.object({
  userId: z.uuid(),
  serviceId: z.uuid().optional(),
  packageId: z.uuid().optional(),
  dateTime: z.string().datetime(),

  a: z.string()
}).refine(
  (data) =>
    (data.serviceId && !data.packageId) ||
    (!data.serviceId && data.packageId),
  { message: "Booking must have either a service OR a package" }
).strict()

export const GET = withErrorHandling(
  withAuth(
    withRole([Role.ADMIN], async () => {
      const bookings = await bookingService.getAllForAdmin()
      return NextResponse.json(bookings, { status: 200 })
    })
  )
)

export const POST = withErrorHandling(
  withAuth(
    withRole(
      [Role.ADMIN],
      withValidation(createBookingSchema, async (body) => {
        const created = await bookingService.create({...body})
        return NextResponse.json(created, { status: 201 })
      })
    )
  )
)
