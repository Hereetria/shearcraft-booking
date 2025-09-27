import { NextRequest, NextResponse } from "next/server"
import { userService } from "@/services/userService"
import { tokenService } from "@/services/tokenService"
import { mailerService } from "@/services/mailerService"
import { z } from "zod"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/errorHandler"

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
}).strict()

export async function POST(req: NextRequest) {
  try {
    const body = validate(forgotPasswordSchema, await req.json())
    const user = await userService.getByEmail(body.email)

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "If an account with that email exists, we've sent a password reset link.",
        },
        { status: 200 }
      )
    }

    let resetToken: string
    try {
      resetToken = await tokenService.createPasswordResetToken(user.id)
    } catch (rateLimitError) {
      if (rateLimitError instanceof Error && rateLimitError.message.includes("Too many")) {
        return NextResponse.json(
          { success: false, error: rateLimitError.message },
          { status: 429 }
        )
      }
      throw rateLimitError
    }

    try {
      await mailerService.sendPasswordResetEmail(user.email, user.name, resetToken)
    } catch {
      return NextResponse.json(
        {
          success: true,
          message: "If an account with that email exists, we've sent a password reset link.",
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "If an account with that email exists, we've sent a password reset link.",
      },
      { status: 200 }
    )
  } catch (err) {
    return handleError(err)
  }
}
