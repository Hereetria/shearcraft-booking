import { NextRequest, NextResponse } from "next/server"
import { packageService } from "@/services/packageService"
import { handleError } from "@/lib/errors/errorHandler"
import { checkRateLimit } from "@/lib/rateLimit"

export async function GET(req: NextRequest) {
  try {
    const rateLimitRes = await checkRateLimit("public-packages", req, 50, { amount: 1, unit: "m" })
    if (rateLimitRes) return handleError(rateLimitRes)
      
    const packages = await packageService.getAllForPublic()
    return NextResponse.json(packages, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}
