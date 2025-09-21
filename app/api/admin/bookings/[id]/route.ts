import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/requireAuth"
import { requireRole } from "@/lib/auth/requireRole"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/error"
import { bookingService } from "@/services/bookingService"
import { requireParam } from "@/lib/requireParam"
import { z } from "zod"
import { Role } from "@prisma/client"
import { notFoundError } from "@/lib/errors/httpErrors"
import { RouteContext } from "@/types/routeTypes"

const updateBookingSchema = z.object({
  serviceId: z.uuid().optional(),
  packageId: z.uuid().optional(),
  dateTime: z.iso.datetime().optional(),
}).refine(
  (data) =>
    (data.serviceId && !data.packageId) ||
    (!data.serviceId && data.packageId) ||
    (!data.serviceId && !data.packageId),
  { message: "Booking must have either a service OR a package" }
).strict()

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

    const id = requireParam("id", await context.params)
    const booking = await bookingService.getByIdForAdmin(id)
    if (!booking) {
      throw notFoundError("Booking not found")
    }

    return NextResponse.json(booking, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

const id = requireParam("id", await context.params)
    const body = validate(updateBookingSchema, await req.json())
    const updated = await bookingService.update(id, { ...body })

    return NextResponse.json(updated, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

const id = requireParam("id", await context.params)
    await bookingService.delete(id)

    return NextResponse.json(null, { status: 204 })
  } catch (err) {
    return handleError(err)
  }
}
