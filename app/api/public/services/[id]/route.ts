import { NextResponse } from "next/server"
import { serviceService } from "@/services/serviceService"
import { requireParam } from "@/lib/requireParam"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"

export const GET = withErrorHandling(async (_req, { params }) => {
  const result = requireParam("id", params)
  if (!result.ok) return result.response

  const service = await serviceService.getByIdForPublic(result.value)
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  return NextResponse.json(service, { status: 200 })
})
