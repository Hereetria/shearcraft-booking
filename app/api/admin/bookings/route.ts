import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/requireAuth"
import { requireRole } from "@/lib/auth/requireRole"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/error"
import { bookingService } from "@/services/bookingService"
import { z } from "zod"
import { Role } from "@prisma/client"

const createBookingSchema = z.object({
  userId: z.uuid(),
  serviceId: z.uuid().optional(),
  packageId: z.uuid().optional(),
  dateTime: z.iso.datetime()
}).refine(
  (data) =>
    (data.serviceId && !data.packageId) ||
    (!data.serviceId && data.packageId),
  { message: "Booking must have either a service OR a package" }
).strict()

export async function GET() {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

    const bookings = await bookingService.getAllForAdmin()
    return NextResponse.json(bookings, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

    const body = validate(createBookingSchema, await req.json())
    const created = await bookingService.create({ ...body })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
