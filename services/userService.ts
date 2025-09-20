import { Prisma } from "@prisma/client"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { userSelfProjection, userAdminProjection } from "@/lib/projections/userProjection"

export const userService = {
  async getAllForAdmin() {
    const users = await prisma.user.findMany()
    return users.map(userAdminProjection)
  },

  async getByIdForAdmin(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? userAdminProjection(user) : null
  },

  async getByIdForSelf(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? userSelfProjection(user) : null
  },

  async create(data: Omit<Prisma.UserCreateInput, "passwordHash"> & { password: string }) {
    const passwordHash = await bcrypt.hash(data.password, 10)
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        isTrusted: data.isTrusted,
      },
    })
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

    return prisma.user.update({ where: { id }, data: updateData })
  },

  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
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
  }
}
