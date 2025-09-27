import { NextRequest, NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { requireAuth } from "@/lib/auth/requireAuth"
import { requireRole } from "@/lib/auth/requireRole"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/errorHandler"
import { userService } from "@/services/userService"
import { z } from "zod"
import { requireParam } from "@/lib/requireParam"
import { zEnumFromPrisma } from "@/lib/validation/zodHelpers"
import { notFoundError } from "@/lib/errors/httpErrors"
import { RouteContext } from "@/types/routeTypes"

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  role: zEnumFromPrisma(Role).optional(),
  isTrusted: z.boolean().optional(),
}).strict()

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

    const id = requireParam("id", await context.params)
    const found = await userService.getByIdForAdmin(id)
    if (!found) {
      throw notFoundError("User not found")
    }

    return NextResponse.json(found, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

// export async function PATCH(req: NextRequest, context: RouteContext) {
//   try {
//     const { user } = await requireAuth()
//     requireRole(user.role, [Role.ADMIN])

//     const id = requireParam("id", await context.params)
//     const body = validate(updateUserSchema, await req.json())
//     const updated = await userService.update(id, { ...body })

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
//     await userService.delete(id)

//     return NextResponse.json(null, { status: 204 })
//   } catch (err) {
//     return handleError(err)
//   }
// }
