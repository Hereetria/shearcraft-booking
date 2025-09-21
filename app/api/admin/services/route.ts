import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/requireAuth"
import { requireRole } from "@/lib/auth/requireRole"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/error"
import { serviceService } from "@/services/serviceService"
import { z } from "zod"
import { Role } from "@prisma/client"

const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  duration: z.number().int().positive(),
}).strict()

export async function GET() {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

    const services = await serviceService.getAllForAdmin()
    return NextResponse.json(services, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

    const body = validate(createServiceSchema, await req.json())
    const created = await serviceService.create(body)

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
