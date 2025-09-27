import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/requireAuth"
import { requireRole } from "@/lib/auth/requireRole"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/errorHandler"
import { packageService } from "@/services/packageService"
import { requireParam } from "@/lib/requireParam"
import { z } from "zod"
import { Role } from "@prisma/client"
import { notFoundError } from "@/lib/errors/httpErrors"
import { RouteContext } from "@/types/routeTypes"

const updatePackageSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  duration: z.number().int().positive().optional(),
}).strict()

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

    const id = requireParam("id", await context.params)
    const pkg = await packageService.getByIdForAdmin(id)
    if (!pkg) {
      throw notFoundError("Package not found")
    }

    return NextResponse.json(pkg, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

// export async function PATCH(req: NextRequest, context: RouteContext) {
//   try {
//     const { user } = await requireAuth()
//     requireRole(user.role, [Role.ADMIN])

//     const id = requireParam("id", await context.params)
//     const body = validate(updatePackageSchema, await req.json())
//     const updated = await packageService.update(id, body)

//     return NextResponse.json(updated, { status: 200 })
//   } catch (err) {
//     return handleError(err)
//   }
// }

// export async function DELETE(_req: NextRequest, context: RouteContext) {
//   try {
//     const { user } = await requireAuth()
//     requireRole(user.role, [Role.ADMIN])

//     const id = requireParam("id", await context.params)
//     await packageService.delete(id)

//     return NextResponse.json(null, { status: 204 })
//   } catch (err) {
//     return handleError(err)
//   }
// }
