import prisma from "@/lib/prisma"
import crypto from "crypto"

export const tokenService = {
  generateToken(): string {
    return crypto.randomBytes(32).toString("hex")
  },

  async createVerificationToken(userId: string): Promise<string> {
    await prisma.verificationToken.deleteMany({ where: { userId } })

    const token = this.generateToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    await prisma.verificationToken.create({
      data: { token, userId, expiresAt },
    })

    return token
  },

  async verifyToken(token: string): Promise<{ userId: string; email: string; name: string } | null> {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      include: {
        user: { select: { id: true, email: true, name: true, emailVerified: true } },
      },
    })

    if (!verificationToken) return null
    if (verificationToken.expiresAt < new Date()) {
      await prisma.verificationToken.delete({ where: { id: verificationToken.id } })
      return null
    }
    if (verificationToken.user.emailVerified) return null

    return {
      userId: verificationToken.user.id,
      email: verificationToken.user.email,
      name: verificationToken.user.name,
    }
  },

  async markUserAsVerified(userId: string): Promise<void> {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true, emailVerifiedAt: new Date() },
      }),
      prisma.verificationToken.deleteMany({ where: { userId } }),
    ])
  },

  async deleteExpiredTokens(): Promise<number> {
    const result = await prisma.verificationToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    })
    return result.count
  },

  async deleteUserToken(userId: string): Promise<void> {
    await prisma.verificationToken.deleteMany({ where: { userId } })
  },

  
  async createPasswordResetToken(userId: string): Promise<string> {
    
    const oneHourAgo = new Date()
    oneHourAgo.setHours(oneHourAgo.getHours() - 1)

    const recentRequests = await prisma.passwordResetToken.count({
      where: {
        userId,
        createdAt: {
          gte: oneHourAgo,
        },
        used: false, 
      },
    })

    if (recentRequests >= 3) {
      throw new Error("Too many password reset requests. Please try again later.")
    }

    
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId,
        expiresAt: {
          lt: new Date(), 
        },
      },
    })

    const token = this.generateToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) 

    await prisma.passwordResetToken.create({
      data: { token, userId, expiresAt, used: false },
    })

    return token
  },

  async validatePasswordResetToken(token: string): Promise<{ userId: string } | null> {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) return null
    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.delete({ where: { id: resetToken.id } })
      return null
    }
    if (resetToken.used) {
      return null 
    }

    return { userId: resetToken.userId }
  },

  async deletePasswordResetToken(token: string): Promise<void> {
    
    await prisma.passwordResetToken.updateMany({
      where: { token },
      data: { used: true },
    })
  },

  async deleteExpiredPasswordResetTokens(): Promise<number> {
    const result = await prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    })
    return result.count
  },
}
