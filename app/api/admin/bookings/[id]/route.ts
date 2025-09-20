import { NextResponse } from "next/server"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withRole } from "@/lib/wrappers/withRole"
import { withValidation } from "@/lib/wrappers/withValidation"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { bookingService } from "@/services/bookingService"
import { requireParam } from "@/lib/requireParam"
import { z } from "zod"
import { Role } from "@prisma/client"

const updateBookingSchema = z.object({
  serviceId: z.uuid().optional(),
  packageId: z.uuid().optional(),
  dateTime: z.string().datetime().optional(),
}).refine(
  (data) =>
    (data.serviceId && !data.packageId) ||
    (!data.serviceId && data.packageId) ||
    (!data.serviceId && !data.packageId),
  { message: "Booking must have either a service OR a package" }
).strict()

export const GET = withErrorHandling(
  withAuth(
    withRole([Role.ADMIN], async (_req, { params }) => {
      const result = requireParam("id", params)
      if (!result.ok) return result.response

      const booking = await bookingService.getByIdForAdmin(result.value)
      if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 })
      }

      return NextResponse.json(booking, { status: 200 })
    })
  )
)

export const PATCH = withErrorHandling(
  withAuth(
    withRole(
      [Role.ADMIN],
      withValidation(updateBookingSchema, async (body, _req, { params }) => {
        const result = requireParam("id", params)
        if (!result.ok) return result.response

        const updated = await bookingService.update(result.value, {...body})
        return NextResponse.json(updated, { status: 200 })
      })
    )
  )
)

export const DELETE = withErrorHandling(
  withAuth(
    withRole([Role.ADMIN], async (_req, { params }) => {
      const result = requireParam("id", params)
      if (!result.ok) return result.response

      await bookingService.delete(result.value)
      return NextResponse.json({ success: true }, { status: 200 })
    })
  )
)
