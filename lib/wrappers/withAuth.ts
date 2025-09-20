import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { RouteHandler, AuthContext, BaseContext } from "@/types/routeTypes"

export function withAuth(handler: RouteHandler<AuthContext>): RouteHandler<BaseContext> {
  return async (req, context) => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(req, {
      ...context,
      userId: session.user.id,
      userRole: session.user.role,
    } as AuthContext)
  }
}
