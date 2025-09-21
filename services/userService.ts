import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { userAdminProjection, userSelfProjection } from "@/lib/projections/userProjection"
import { logInfo } from "@/lib/logger"

export const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isTrusted: true,
  createdAt: true,
  updatedAt: true,
} as const

export const userService = {
  async getAllForAdmin() {
    const users = await prisma.user.findMany({ select: userSafeSelect })
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
        role: data.role,
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
      },
    })
  },
}
