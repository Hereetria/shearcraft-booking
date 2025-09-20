import { User } from "@prisma/client"

export function userSelfProjection(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isTrusted: user.isTrusted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function userAdminProjection(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isTrusted: user.isTrusted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}
