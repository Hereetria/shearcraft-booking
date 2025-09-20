import { NextResponse } from "next/server";
import { userService } from "@/services/userService";
import { z } from "zod"
import { publicRoute } from "@/lib/routeBuilder";
import { withValidation } from "@/lib/wrappers/withValidation";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).strict()

export const POST = publicRoute(
  withValidation(registerSchema)(
    async (_req, ctx) => {
      // ctx.body burada zod’dan otomatik tiplenmiş
      const created = await userService.create(ctx.body)
      return NextResponse.json(created, { status: 201 })
    }
  )
)
