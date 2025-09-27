import { Package, Service } from "@prisma/client"
import { servicePublicProjection } from "./serviceProjection"

export function packagePublicProjection(
  pkg: Package & { services?: { service: Service }[] }
) {
  return {
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    duration: pkg.duration,
    services: pkg.services
      ? pkg.services.map((ps) => servicePublicProjection(ps.service))
      : [],
  }
}

export function packageAdminProjection(
  pkg: Package & { services?: { service: Service }[]; _count?: { bookings: number } }
) {
  return {
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    duration: pkg.duration,
    services: pkg.services
      ? pkg.services.map((ps) => servicePublicProjection(ps.service))
      : [],
    createdAt: pkg.createdAt,
    updatedAt: pkg.updatedAt,
    _count: pkg._count
  }
}
