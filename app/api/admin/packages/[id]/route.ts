import { NextResponse } from "next/server"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withRole } from "@/lib/wrappers/withRole"
import { withValidation } from "@/lib/wrappers/withValidation"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { packageService } from "@/services/packageService"
import { requireParam } from "@/lib/requireParam"
import { z } from "zod"
import { Role } from "@prisma/client"

const updatePackageSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  duration: z.number().int().positive().optional(),
}).strict()

export const GET = withErrorHandling(
  withAuth(
    withRole([Role.ADMIN], async (_req, { params }) => {
      const result = requireParam("id", params)
      if (!result.ok) return result.response

      const pkg = await packageService.getByIdForAdmin(result.value)
      if (!pkg) {
        return NextResponse.json({ error: "Package not found" }, { status: 404 })
      }

      return NextResponse.json(pkg, { status: 200 })
    })
  )
)

export const PATCH = withErrorHandling(
  withAuth(
    withRole(
      [Role.ADMIN],
      withValidation(updatePackageSchema, async (body, _req, { params }) => {
        const result = requireParam("id", params)
        if (!result.ok) return result.response

        const updated = await packageService.update(result.value, body)
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

      await packageService.delete(result.value)
      return NextResponse.json({ success: true }, { status: 200 })
    })
  )
)
