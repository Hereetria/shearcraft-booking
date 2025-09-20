import { Booking, Service, Package, User } from "@prisma/client"
import { servicePublicProjection } from "./serviceProjection"
import { packagePublicProjection } from "./packageProjection"

export function bookingSelfProjection(
  booking: Booking & { service?: Service | null; package?: Package | null }
) {
  return {
    id: booking.id,
    dateTime: booking.dateTime,
    status: booking.status,
    service: booking.service
      ? servicePublicProjection(booking.service)
      : null,
    package: booking.package
      ? packagePublicProjection(booking.package)
      : null,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  }
}

export function bookingAdminProjection(
  booking: Booking & { user: User; service?: Service | null; package?: Package | null }
) {
  return {
    id: booking.id,
    dateTime: booking.dateTime,
    status: booking.status,
    user: {
      id: booking.user.id,
      name: booking.user.name,
      email: booking.user.email,
    },
    service: booking.service
      ? servicePublicProjection(booking.service)
      : null,
    package: booking.package
      ? packagePublicProjection(booking.package)
      : null,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  }
}

export function bookingPublicProjection(booking: Booking) {
  return {
    id: booking.id,
    dateTime: booking.dateTime,
    status: booking.status,
  }
}
