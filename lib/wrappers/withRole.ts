import { NextResponse } from "next/server"
import { RouteHandler, AuthContext } from "@/types/routeTypes"

export function withRole(allowedRoles: string[]) {
  return (handler: RouteHandler<AuthContext>): RouteHandler<AuthContext> => {
    return async (req, context) => {
      if (!context.userRole || !allowedRoles.includes(context.userRole)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
      return handler(req, context)
    }
  }
}
