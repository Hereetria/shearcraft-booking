import { NextResponse } from "next/server"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withRole } from "@/lib/wrappers/withRole"
import { withValidation } from "@/lib/wrappers/withValidation"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { serviceService } from "@/services/serviceService"
import { z } from "zod"
import { Role } from "@prisma/client"

const createServiceSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  duration: z.number().int().positive(),
}).strict()

export const GET = withErrorHandling(
  withAuth(
    withRole([Role.ADMIN], async () => {
      const services = await serviceService.getAllForAdmin()
      return NextResponse.json(services, { status: 200 })
    })
  )
)

export const POST = withErrorHandling(
  withAuth(
    withRole(
      [Role.ADMIN],
      withValidation(createServiceSchema, async (body) => {
        const created = await serviceService.create(body)
        return NextResponse.json(created, { status: 201 })
      })
    )
  )
)
