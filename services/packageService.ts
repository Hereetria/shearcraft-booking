import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import { packageAdminProjection, packagePublicProjection } from "@/lib/projections/packageProjection"
import { logInfo } from "@/lib/logger"

export const packageService = {
  async getAllForAdmin() {
    const packages = await prisma.package.findMany({
      include: {
        services: {
          include: {
            service: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      }
    })
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
    const pkg = await prisma.package.create({ data })
    logInfo("Package created", { packageId: pkg.id })
    return pkg
  },

  async update(id: string, data: Prisma.PackageUpdateInput) {
    const pkg = await prisma.package.update({ where: { id }, data })
    logInfo("Package updated", { packageId: pkg.id })
    return pkg
  },

  async delete(id: string) {
    const pkg = await prisma.package.delete({ where: { id } })
    logInfo("Package deleted", { packageId: pkg.id })
    return pkg
  },
}
