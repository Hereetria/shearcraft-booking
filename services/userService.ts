import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { userAdminProjection, userSelfProjection } from "@/lib/projections/userProjection"
import { logError, logInfo } from "@/lib/logger"

export const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isTrusted: true,
  emailVerified: true,
  emailVerifiedAt: true,
  image: true,
  createdAt: true,
  updatedAt: true,
} as const

export const userService = {
  async getAllForAdmin() {
    const users = await prisma.user.findMany({ 
      select: {
        ...userSafeSelect,
        _count: {
          select: {
            bookings: {
              where: {
                status: {
                  in: ['PENDING', 'APPROVED']
                }
              }
            }
          }
        }
      }
    })
    return users.map(userAdminProjection)
  },

  async getByIdForAdmin(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSafeSelect,
    })
    return user ? userAdminProjection(user) : null
  },

  async getByIdForSelf(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSafeSelect,
    })
    return user ? userSelfProjection(user) : null
  },

  async create(data: Omit<Prisma.UserCreateInput, "passwordHash"> & { password: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role ?? "CUSTOMER", 
        isTrusted: data.isTrusted,
      },
    })
    logInfo("User created", { userId: user.id, email: user.email })
    return user
  },

  async update(id: string, data: Omit<Prisma.UserUpdateInput, "passwordHash"> & { password?: string }) {
    const updateData: Prisma.UserUpdateInput = {
      name: data.name,
      email: data.email,
      role: data.role,
      isTrusted: data.isTrusted,
    }

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10)
    }

    const user = await prisma.user.update({ where: { id }, data: updateData })
    logInfo("User updated", { userId: user.id, email: user.email })
    return user
  },

  async delete(id: string) {
    const user = await prisma.user.delete({ where: { id } })
    logInfo("User deleted", { userId: user.id, email: user.email })
    return user
  },

  async getByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        emailVerified: true,
      },
    })
  },

  async updatePassword(userId: string, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })
  },

  async getById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        emailVerified: true,
      },
    })
  },

  async upsertGoogleUser(profile: { 
    email: string; 
    name: string; 
    picture?: string; 
  }) {
    try {
      const user = await prisma.user.upsert({
        where: { email: profile.email },
        update: {
          name: profile.name,
          image: profile.picture,
          updatedAt: new Date(),
        },
        create: {
          name: profile.name,
          email: profile.email,
          role: "CUSTOMER",
          emailVerified: true,
          emailVerifiedAt: new Date(),
          image: profile.picture,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          image: true,
        },
      });
  
      logInfo(user ? "Google user upserted" : "Google user created", {
        userId: user.id,
        email: user.email,
      });
  
      return user;
    } catch (error) {
      logError(error, `Failed to upsert Google user: ${profile.email}`);
      throw new Error("Failed to create or update Google user");
    }
  }
  
}
