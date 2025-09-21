import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth"
import { unauthorizedError } from "@/lib/errors/httpErrors"

export async function requireAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw unauthorizedError()
  }

  return {
    user: {
      id: session.user.id,
      role: session.user.role,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
    },
  }
}