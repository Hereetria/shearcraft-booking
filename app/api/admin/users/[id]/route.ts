import { NextResponse } from "next/server"
import { Role } from "@prisma/client"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withRole } from "@/lib/wrappers/withRole"
import { withValidation } from "@/lib/wrappers/withValidation"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { userService } from "@/services/userService"
import { z } from "zod"
import { requireParam } from "@/lib/requireParam"
import { zEnumFromPrisma } from "@/lib/zodHelpers"

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  role: zEnumFromPrisma(Role).optional(),
  isTrusted: z.boolean().optional(),
}).strict()

export const GET = withErrorHandling(
  withAuth(
    withRole([Role.ADMIN], async (_req, { params }) => {
      const result = requireParam("id", params)
      if (!result.ok) return result.response

      const user = await userService.getByIdForAdmin(result.value)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      return NextResponse.json(user)
    })
  )
)

export const PATCH = withErrorHandling(
  withAuth(
    withRole(
      [Role.ADMIN],
      withValidation(updateUserSchema, async (body, _req, { params }) => {
        const result = requireParam("id", params)
        if (!result.ok) return result.response

        const updated = await userService.update(result.value, { ...body })
        return NextResponse.json(updated)
      })
    )
  )
)

export const DELETE = withErrorHandling(
  withAuth(
    withRole([Role.ADMIN], async (_req, { params }) => {
      const result = requireParam("id", params)
      if (!result.ok) return result.response

      await userService.delete(result.value)
      return NextResponse.json(null, { status: 204 })
    })
  )
)
