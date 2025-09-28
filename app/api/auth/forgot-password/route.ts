import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { userService } from "@/services/userService"
import { tokenService } from "@/services/tokenService"
import { mailerService } from "@/services/mailerService"
import { checkRateLimit } from "@/lib/rateLimit"
import { handleError } from "@/lib/errors/errorHandler"
import { validate } from "@/lib/validation/validate"
const forgotPasswordSchema = z
  .object({
    email: z.email("Invalid email address"),
  })
  .strict()

export async function POST(req: NextRequest) {
  try {
    const rateLimitRes = await checkRateLimit(
      "forgot-password",
      req,
      3,
      { amount: 10, unit: "m" }
    );
    
    if (rateLimitRes) return rateLimitRes;

    const body = validate(forgotPasswordSchema, await req.json())
    const user = await userService.getByEmail(body.email)

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account with that email exists, we've sent a password reset link.",
        },
        { status: 200 }
      )
    }

    const resetToken = await tokenService.createPasswordResetToken(user.id)

    try {
      await mailerService.sendPasswordResetEmail(user.email, user.name, resetToken)
    } catch {
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account with that email exists, we've sent a password reset link.",
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with that email exists, we've sent a password reset link.",
      },
      { status: 200 }
    )
  } catch (err) {
    return handleError(err)
  }
}
