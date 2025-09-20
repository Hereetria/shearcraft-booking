import { NextResponse } from "next/server"
import { packageService } from "@/services/packageService"
import { requireParam } from "@/lib/requireParam"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"

export const GET = withErrorHandling(async (_req, { params }) => {
  const result = requireParam("id", params)
  if (!result.ok) return result.response

  const pkg = await packageService.getByIdForPublic(result.value)
  if (!pkg) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 })
  }

  return NextResponse.json(pkg, { status: 200 })
})