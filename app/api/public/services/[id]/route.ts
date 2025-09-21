import { NextRequest, NextResponse } from "next/server"
import { serviceService } from "@/services/serviceService"
import { requireParam } from "@/lib/requireParam"
import { handleError } from "@/lib/errors/error"
import { notFoundError } from "@/lib/errors/httpErrors"
import { RouteContext } from "@/types/routeTypes"

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
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
