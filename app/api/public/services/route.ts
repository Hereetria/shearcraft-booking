import { NextResponse } from "next/server"
import { serviceService } from "@/services/serviceService"
import { handleError } from "@/lib/errors/error"

export async function GET() {
  try {
    const services = await serviceService.getAllForPublic()
    return NextResponse.json(services, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}
