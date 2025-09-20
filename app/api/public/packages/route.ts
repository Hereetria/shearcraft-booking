import { NextResponse } from "next/server"
import { packageService } from "@/services/packageService"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"

export async function GET() {
  return withErrorHandling(async () => {
    const packages = await packageService.getAllForPublic()
    return NextResponse.json(packages, { status: 200 })
  })
}
