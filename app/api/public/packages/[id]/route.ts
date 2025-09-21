import { NextRequest, NextResponse } from "next/server"
import { packageService } from "@/services/packageService"
import { requireParam } from "@/lib/requireParam"
import { handleError } from "@/lib/errors/error"
import { notFoundError } from "@/lib/errors/httpErrors"
import { RouteContext } from "@/types/routeTypes"

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const id = requireParam("id", await context.params)
    const pkg = await packageService.getByIdForPublic(id)
    if (!pkg) {
      throw notFoundError("Package not found")
    }
    return NextResponse.json(pkg, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}
