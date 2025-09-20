import { NextResponse } from "next/server"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withRole } from "@/lib/wrappers/withRole"
import { withValidation } from "@/lib/wrappers/withValidation"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { packageService } from "@/services/packageService"
import { z } from "zod"
import { Role } from "@prisma/client"

const createPackageSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  duration: z.number().int().positive(),
}).strict()

export const GET = withErrorHandling(
  withAuth(
    withRole([Role.ADMIN], async () => {
      const packages = await packageService.getAllForAdmin()
      return NextResponse.json(packages, { status: 200 })
    })
  )
)

export const POST = withErrorHandling(
  withAuth(
    withRole(
      [Role.ADMIN],
      withValidation(createPackageSchema, async (body) => {
        const created = await packageService.create(body)
        return NextResponse.json(created, { status: 201 })
      })
    )
  )
)
