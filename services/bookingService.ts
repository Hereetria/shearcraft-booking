import prisma from "@/lib/prisma"
import { bookingAdminProjection, bookingSelfProjection } from "@/lib/projections/bookingProjection"
import { servicePublicProjection } from "@/lib/projections/serviceProjection"
import { logInfo } from "@/lib/logger"

export const bookingService = {
  async getAllForAdmin() {
    const bookings = await prisma.booking.findMany({
      where: {
        parentBookingId: null,
      },
      include: { 
        user: true,
        service: true,
        package: {
          include: {
            services: {
              include: {
                service: true
              }
            }
          }
        }
      },
    })
    return bookings.map(bookingAdminProjection)
  },

  async getByIdForAdmin(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { 
        user: true,
        service: true,
        package: {
          include: {
            services: {
              include: {
                service: true
              }
            }
          }
        }
      },
    })
    return booking ? bookingAdminProjection(booking) : null
  },

  async getAllForSelf(userId: string) {
    const bookings = await prisma.booking.findMany({ 
      where: { 
        userId,
        parentBookingId: null,
      },
      include: {
        service: true,
        package: {
          include: {
            services: {
              include: {
                service: true
              }
            }
          }
        }
      }
    })
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

  async getBookingsForDate(date: string, currentUserId?: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["PENDING", "APPROVED"],
        },
        parentBookingId: {
          not: null,
        },
      },
      select: {
        id: true,
        dateTime: true,
        status: true,
        userId: true,
        duration: true,
        service: {
          select: {
            duration: true,
          },
        },
        package: {
          select: {
            duration: true,
          },
        },
      },
    });

    return bookings.map(booking => ({
      ...booking,
      isOwnBooking: currentUserId ? booking.userId === currentUserId : false,
    }));
  },

  async create(input: { 
    userId: string; 
    serviceIds?: string[]; 
    packageId?: string; 
    dateTime: string;
    duration: number;
  }) {
    if (input.serviceIds && input.serviceIds.length > 0 && input.packageId) {
      throw new Error("Cannot book both services and package together");
    }
    
    if (!input.serviceIds || input.serviceIds.length === 0) {
      if (!input.packageId) {
        throw new Error("Must select either services or package");
      }
    }

    let servicesData: Array<{ id: string; name: string; duration: number; price: number }> | null = null;
    if (input.serviceIds && input.serviceIds.length > 0) {
      const services = await prisma.service.findMany({
        where: { id: { in: input.serviceIds } },
        select: { id: true, name: true, duration: true, price: true }
      });
      servicesData = services;
    }

    const primaryServiceId = input.serviceIds?.length === 1 ? input.serviceIds[0] : undefined;
    
    const mainBooking = await prisma.booking.create({
      data: {
        user: { connect: { id: input.userId } },
        service: primaryServiceId ? { connect: { id: primaryServiceId } } : undefined,
        package: input.packageId ? { connect: { id: input.packageId } } : undefined,
        dateTime: input.dateTime,
        duration: input.duration,
        services: servicesData || undefined,
      },
    });

    const slotBookings = [];
    const startTime = new Date(input.dateTime);
    const numberOfSlots = input.duration / 30;

    for (let i = 0; i < numberOfSlots; i++) {
      const slotTime = new Date(startTime);
      slotTime.setMinutes(startTime.getMinutes() + (i * 30));

      const slotBooking = await prisma.booking.create({
        data: {
          user: { connect: { id: input.userId } },
          service: primaryServiceId ? { connect: { id: primaryServiceId } } : undefined,
          package: input.packageId ? { connect: { id: input.packageId } } : undefined,
          dateTime: slotTime,
          duration: 30,
          services: servicesData || undefined,
          parentBooking: { connect: { id: mainBooking.id } },
        },
      });
      

      slotBookings.push(slotBooking);
    }
    
    logInfo("Booking created", { 
      mainBookingId: mainBooking.id, 
      slotBookingIds: slotBookings.map(sb => sb.id),
      userId: input.userId,
      duration: input.duration,
      serviceIds: input.serviceIds,
      packageId: input.packageId
    })
    
    return mainBooking
  },

  async update(id: string, input: { serviceId?: string; packageId?: string; dateTime?: string }) {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        service: input.serviceId ? { connect: { id: input.serviceId } } : undefined,
        package: input.packageId ? { connect: { id: input.packageId } } : undefined,
        dateTime: input.dateTime,
      },
    })
    logInfo("Booking updated", { bookingId: booking.id })
    return booking
  },

  async cancel(id: string, userId: string) {
    const booking = await prisma.booking.findFirst({
      where: { id, userId }
    })
    
    if (!booking) {
      throw new Error("Booking not found or access denied")
    }
    
    if (booking.status === "CANCELLED") {
      throw new Error("Booking is already cancelled")
    }
    
    if (booking.status === "EXPIRED") {
      throw new Error("Cannot cancel expired bookings")
    }
    
    if (booking.status === "APPROVED") {
      throw new Error("Cannot cancel approved bookings. Please contact support.")
    }
    
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { 
        status: "CANCELLED",
        updatedAt: new Date()
      },
    })
    
    logInfo("Booking cancelled", { 
      bookingId: id, 
      userId,
      previousStatus: booking.status
    })
    
    return updatedBooking
  },

  async delete(id: string) {
    await prisma.booking.deleteMany({
      where: {
        parentBookingId: id,
      },
    });

    const deletedBooking = await prisma.booking.delete({
      where: { id },
    });

    logInfo("Booking deleted", { 
      bookingId: id,
      deletedAt: new Date().toISOString()
    });

    return deletedBooking;
  },

  async updateExpiredBookings() {
    const now = new Date();
    
    const expiredBookings = await prisma.booking.findMany({
      where: {
        status: {
          in: ["PENDING", "APPROVED"]
        },
        dateTime: {
          lt: now
        }
      }
    });

    if (expiredBookings.length === 0) {
      return { updatedCount: 0 };
    }

    const result = await prisma.booking.updateMany({
      where: {
        id: {
          in: expiredBookings.map(booking => booking.id)
        }
      },
      data: {
        status: "EXPIRED",
        updatedAt: now
      }
    });

    logInfo("Expired bookings updated", { 
      updatedCount: result.count,
      bookingIds: expiredBookings.map(b => b.id)
    });

    return { updatedCount: result.count };
  },
}
