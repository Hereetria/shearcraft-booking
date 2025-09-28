import { NextRequest, NextResponse } from "next/server"
import { serviceService } from "@/services/serviceService"
import { requireParam } from "@/lib/requireParam"
import { handleError } from "@/lib/errors/errorHandler"
import { notFoundError } from "@/lib/errors/httpErrors"
import { RouteContext } from "@/types/routeTypes"
import { checkRateLimit } from "@/lib/rateLimit"

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const rateLimitRes = await checkRateLimit("public-package", req, 50, { amount: 1, unit: "m" })
    if (rateLimitRes) return handleError(rateLimitRes)
      
    const id = requireParam("id", await context.params)
    const service = await serviceService.getByIdForPublic(id)
    if (!service) {
      throw notFoundError("Service not found")
    }
    return NextResponse.json(service, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}
