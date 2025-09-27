import { NextRequest, NextResponse } from "next/server"
import { userService } from "@/services/userService"
import { tokenService } from "@/services/tokenService"
import { mailerService } from "@/services/mailerService"
import { z } from "zod"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/errorHandler"
import { RegisterResponse } from "@/types/apiResponses"

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
}).strict()

export async function POST(req: NextRequest): Promise<NextResponse<RegisterResponse>> {
  try {
    const body = validate(registerSchema, await req.json())
    const created = await userService.create(body)
    const verificationToken = await tokenService.createVerificationToken(created.id)

    try {
      await mailerService.sendVerificationEmail(created.email, created.name, verificationToken)
      return NextResponse.json(
        {
          status: 201,
          email: created.email,
          message: "Account created successfully. Please check your email to verify your account.",
        },
        { status: 201 }
      )
    } catch {
      return NextResponse.json(
        {
          status: 201,
          email: created.email,
          warning: "Account created but verification email could not be sent. Please request a new one.",
        },
        { status: 201 }
      )
    }
  } catch (err) {
    return handleError(err)
  }
}
