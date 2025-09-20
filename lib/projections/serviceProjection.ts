import { Service } from "@prisma/client"

export function servicePublicProjection(service: Service) {
  return {
    id: service.id,
    name: service.name,
    duration: service.duration,
    price: service.price,
  }
}

export function serviceAdminProjection(service: Service) {
  return {
    id: service.id,
    name: service.name,
    duration: service.duration,
    price: service.price,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  }
}
