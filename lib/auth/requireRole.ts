import { Role } from "@prisma/client"
import { forbiddenError, unauthorizedError } from "@/lib/errors/httpErrors"

export function requireRole(userRole: Role | undefined, allowed: Role[]) {
  if (!userRole) {
    throw unauthorizedError()
  }
  if (!allowed.includes(userRole)) {
    throw forbiddenError()
  }
}
