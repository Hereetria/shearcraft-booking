import prisma from "@/lib/prisma"
import { bookingSelfProjection, bookingAdminProjection } from "@/lib/projections/bookingProjection"
import { servicePublicProjection } from "@/lib/projections/serviceProjection"

export const bookingService = {
  async getAllForAdmin() {
    const bookings = await prisma.booking.findMany({
      include: { user: true },
    })
    return bookings.map(bookingAdminProjection)
  },

  async getByIdForAdmin(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true },
    })
    return booking ? bookingAdminProjection(booking) : null
  },

  async getAllForSelf(userId: string) {
    const bookings = await prisma.booking.findMany({ where: { userId } })
    return bookings.map(bookingSelfProjection)
  },

  async getByIdForSelf(id: string, userId: string) {
    const booking = await prisma.booking.findFirst({ where: { id, userId } })
    return booking ? bookingSelfProjection(booking) : null
  },

    async getAllForPublic() {
    const services = await prisma.service.findMany()
    return services.map(servicePublicProjection)
  },

    async getByIdForPublic(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
    })
    return service ? servicePublicProjection(service) : null
  },

  async create(input: { userId: string; serviceId?: string; packageId?: string; dateTime: string }) {
    return prisma.booking.create({
      data: {
        user: { connect: { id: input.userId } },
        service: input.serviceId ? { connect: { id: input.serviceId } } : undefined,
        package: input.packageId ? { connect: { id: input.packageId } } : undefined,
        dateTime: input.dateTime,
      },
    })
  },

  async update(id: string, input: { serviceId?: string; packageId?: string; dateTime?: string }) {
    return prisma.booking.update({
      where: { id },
      data: {
        service: input.serviceId ? { connect: { id: input.serviceId } } : undefined,
        package: input.packageId ? { connect: { id: input.packageId } } : undefined,
        dateTime: input.dateTime,
      },
    })
  },


  async delete(id: string) {
    return prisma.booking.delete({ where: { id } })
  },
}
