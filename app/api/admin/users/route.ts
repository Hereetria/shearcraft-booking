import { NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withRole } from "@/lib/wrappers/withRole"
import { withValidation } from "@/lib/wrappers/withValidation"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { userService } from "@/services/userService"
import { z } from "zod"
import { zEnumFromPrisma } from "@/lib/zodHelpers"

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
  role: zEnumFromPrisma(Role),
  isTrusted: z.boolean().optional(),
}).strict()

export const GET = withErrorHandling(
  withAuth(
    withRole([Role.ADMIN], async () => {
      const users = await userService.getAllForAdmin()
      return NextResponse.json(users)
    })
  )
)

export const POST = withErrorHandling(
  withAuth(
    withRole(
      [Role.ADMIN],
      withValidation(createUserSchema, async (body) => {
        const created = await userService.create({ ...body })
        return NextResponse.json(created, { status: 201 })
      })
    )
  )
)
