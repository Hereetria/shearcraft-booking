import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import { servicePublicProjection, serviceAdminProjection } from "@/lib/projections/serviceProjection"
import { logInfo } from "@/lib/logger"

export const serviceService = {
  async getAllForAdmin() {
    const services = await prisma.service.findMany({
      include: {
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })
    return services.map(serviceAdminProjection)
  },

  async getByIdForAdmin(id: string) {
    const service = await prisma.service.findUnique({ where: { id } })
    return service ? serviceAdminProjection(service) : null
  },

  async getAllForPublic() {
    const services = await prisma.service.findMany()
    return services.map(servicePublicProjection)
  },

  async getByIdForPublic(id: string) {
    const service = await prisma.service.findUnique({ where: { id } })
    return service ? servicePublicProjection(service) : null
  },

  async create(data: Prisma.ServiceCreateInput) {
    const service = await prisma.service.create({ data })
    logInfo("Service created", { serviceId: service.id })
    return service
  },

  async update(id: string, data: Prisma.ServiceUpdateInput) {
    const service = await prisma.service.update({ where: { id }, data })
    logInfo("Service updated", { serviceId: service.id })
    return service
  },

  async delete(id: string) {
    const service = await prisma.service.delete({ where: { id } })
    logInfo("Service deleted", { serviceId: service.id })
    return service
  },
}
