import { User } from "@prisma/client"

type SafeUser = Omit<User, "passwordHash">

export function userSelfProjection(user: SafeUser) {
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

export function userAdminProjection(user: SafeUser) {
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