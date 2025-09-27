import { NextRequest, NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { requireAuth } from "@/lib/auth/requireAuth"
import { requireRole } from "@/lib/auth/requireRole"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/errorHandler"
import { userService } from "@/services/userService"
import { z } from "zod"
import { zEnumFromPrisma } from "@/lib/validation/zodHelpers"

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  role: zEnumFromPrisma(Role),
  isTrusted: z.boolean().optional(),
}).strict()

export async function GET() {
  try {
    const { user } = await requireAuth()
    requireRole(user.role, [Role.ADMIN])

    const users = await userService.getAllForAdmin()
    return NextResponse.json(users, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const { user } = await requireAuth()
//     requireRole(user.role, [Role.ADMIN])

//     const body = validate(createUserSchema, await req.json())
//     const created = await userService.create({ ...body })

//     return NextResponse.json(created, { status: 201 })
//   } catch (err) {
//     return handleError(err)
//   }
// }
