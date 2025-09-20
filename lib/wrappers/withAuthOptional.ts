import { authOptions } from "@/lib/auth"
import { RouteHandler, MaybeAuthContext, BaseContext } from "@/types/routeTypes"
import { getServerSession } from "next-auth"

export function withAuthOptional(
  handler: RouteHandler<MaybeAuthContext>
): RouteHandler<BaseContext> {
  return async (req, context) => {
    const session = await getServerSession(authOptions)

    if (session?.user?.id) {
      return handler(req, {
        ...context,
        userId: session.user.id,
        userRole: session.user.role,
      } as MaybeAuthContext)
    }

    return handler(req, {
      ...context,
    } as MaybeAuthContext)
  }
}
