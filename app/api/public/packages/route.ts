import { NextResponse } from "next/server"
import { packageService } from "@/services/packageService"
import { handleError } from "@/lib/errors/error"

export async function GET() {
  try {
    const packages = await packageService.getAllForPublic()
    return NextResponse.json(packages, { status: 200 })
  } catch (err) {
    return handleError(err)
  }
}
