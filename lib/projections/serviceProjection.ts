import { Service } from "@prisma/client"

export function servicePublicProjection(service: Service) {
  return {
    id: service.id,
    name: service.name,
    duration: service.duration,
    price: service.price,
  }
}

export function serviceAdminProjection(service: Service & { _count?: { bookings: number } }) {
  return {
    id: service.id,
    name: service.name,
    duration: service.duration,
    price: service.price,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    _count: service._count
  }
}
