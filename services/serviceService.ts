import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import { servicePublicProjection, serviceAdminProjection } from "@/lib/projections/serviceProjection"

export const serviceService = {
  async getAllForAdmin() {
    const services = await prisma.service.findMany()
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
    return prisma.service.create({ data })
  },

  async update(id: string, data: Prisma.ServiceUpdateInput) {
    return prisma.service.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.service.delete({ where: { id } })
  },
}
