import { NextResponse } from "next/server"
import { serviceService } from "@/services/serviceService"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"

export const GET = withErrorHandling(async () => {
  const services = await serviceService.getAllForPublic()
  return NextResponse.json(services, { status: 200 })
})
