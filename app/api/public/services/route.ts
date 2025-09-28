import { NextRequest, NextResponse } from "next/server"
import { serviceService } from "@/services/serviceService"
import { handleError } from "@/lib/errors/errorHandler"
import { checkRateLimit } from "@/lib/rateLimit"

export async function GET(req: NextRequest) {
  try {
    const rateLimitRes = await checkRateLimit("public-services", req, 50, { amount: 1, unit: "m" })
    if (rateLimitRes) return handleError(rateLimitRes)
      
    const services = await serviceService.getAllForPublic()
    return NextResponse.json(services, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}
