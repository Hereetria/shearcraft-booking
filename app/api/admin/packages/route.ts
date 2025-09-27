import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/requireAuth"
import { requireRole } from "@/lib/auth/requireRole"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/errorHandler"
import { packageService } from "@/services/packageService"
import { z } from "zod"
import { Role } from "@prisma/client"

const createPackageSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  duration: z.number().int().positive(),
}).strict()

export async function GET() {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

    const packages = await packageService.getAllForAdmin()
    return NextResponse.json(packages, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const { user } = await requireAuth()
//     requireRole(user.role, [Role.ADMIN])

//     const body = validate(createPackageSchema, await req.json())
//     const created = await packageService.create(body)

//     return NextResponse.json(created, { status: 201 })
//   } catch (err) {
//     return handleError(err)
//   }
// }
