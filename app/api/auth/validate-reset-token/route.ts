import { NextRequest, NextResponse } from "next/server";
import { tokenService } from "@/services/tokenService";
import { handleError } from "@/lib/errors/errorHandler";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const isValid = await tokenService.validatePasswordResetToken(token);

    return NextResponse.json(
      { valid: isValid !== null },
      { status: 200 }
    );
  } catch (err) {
    return handleError(err);
  }
}
