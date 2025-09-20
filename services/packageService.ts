import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import { packagePublicProjection, packageAdminProjection } from "@/lib/projections/packageProjection"

export const packageService = {
  async getAllForAdmin() {
    const packages = await prisma.package.findMany()
    return packages.map(packageAdminProjection)
  },

  async getByIdForAdmin(id: string) {
    const pkg = await prisma.package.findUnique({ where: { id } })
    return pkg ? packageAdminProjection(pkg) : null
  },

  async getAllForPublic() {
    const packages = await prisma.package.findMany()
    return packages.map(packagePublicProjection)
  },

  async getByIdForPublic(id: string) {
    const pkg = await prisma.package.findUnique({ where: { id } })
    return pkg ? packagePublicProjection(pkg) : null
  },

  async create(data: Prisma.PackageCreateInput) {
    return prisma.package.create({ data })
  },

  async update(id: string, data: Prisma.PackageUpdateInput) {
    return prisma.package.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.package.delete({ where: { id } })
  },
}
