import { NextRequest, NextResponse } from "next/server"
import { userService } from "@/services/userService"
import { tokenService } from "@/services/tokenService"
import { z } from "zod"
import { validate } from "@/lib/validation/validate"
import { handleError } from "@/lib/errors/errorHandler"
import bcrypt from "bcryptjs"

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).strict()

export async function POST(req: NextRequest) {
  try {
    const body = validate(resetPasswordSchema, await req.json())
    const tokenData = await tokenService.validatePasswordResetToken(body.token)

    if (!tokenData) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    const user = await userService.getById(tokenData.userId)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    if (user.passwordHash) {
      const isSamePassword = await bcrypt.compare(body.password, user.passwordHash)
      if (isSamePassword) {
        return NextResponse.json(
          { success: false, error: "New password cannot be the same as the old password." },
          { status: 400 }
        )
      }
    }

    const hashedPassword = await bcrypt.hash(body.password, 12)
    await userService.updatePassword(tokenData.userId, hashedPassword)
    await tokenService.deletePasswordResetToken(body.token)

    return NextResponse.json(
      { success: true, message: "Password has been reset successfully" },
      { status: 200 }
    )
  } catch (err) {
    return handleError(err)
  }
}
