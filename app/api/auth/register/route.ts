import { NextRequest, NextResponse } from "next/server"
import { userService } from "@/services/userService"
import { z } from "zod"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/error"

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
}).strict()

export async function POST(req: NextRequest) {
  try {
    const body = validate(registerSchema, await req.json())
    const created = await userService.create(body)
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    return handleError(err)
  }
}
