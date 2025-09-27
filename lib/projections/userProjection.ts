import { User } from "@prisma/client"

type SafeUser = Omit<User, "passwordHash">

type UserWithBookingCount = SafeUser & {
  _count?: {
    bookings: number;
  };
}

export function userSelfProjection(user: SafeUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isTrusted: user.isTrusted,
    emailVerified: user.emailVerified,
    emailVerifiedAt: user.emailVerifiedAt,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function userAdminProjection(user: UserWithBookingCount) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isTrusted: user.isTrusted,
    emailVerified: user.emailVerified,
    emailVerifiedAt: user.emailVerifiedAt,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    _count: user._count
  }
}