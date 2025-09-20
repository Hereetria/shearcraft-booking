import { NextResponse } from "next/server"
import { RouteHandler, BaseContext } from "@/types/routeTypes"

export function withErrorHandling<C extends BaseContext>(
  handler: RouteHandler<C>
): RouteHandler<C> {
  return async (req, context) => {
    try {
      return await handler(req, context)
    } catch (error) {
      console.error("Unexpected error:", error)
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  }
}
