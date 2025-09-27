import { randomBytes } from "crypto";
import prisma from "@/lib/prisma";
import { logInfo, logError } from "@/lib/logger";

export const refreshTokenService = {

  generateToken(): string {
    return randomBytes(32).toString("hex");
  },

  async createToken(userId: string, rememberMe: boolean = false): Promise<string> {
    const expiresAt = new Date();
    if (rememberMe) {
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else {
      expiresAt.setHours(expiresAt.getHours() + 1);
    }

    const token = this.generateToken();

    try {
      await this.revokeAllUserTokens(userId);

      await prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt,
        },
      });

      logInfo("Refresh token created", { 
        userId, 
        rememberMe, 
        expiresAt: expiresAt.toISOString() 
      });

      return token;
    } catch (error) {
      logError(error, `Failed to create refresh token for user ${userId}`);
      throw new Error("Failed to create refresh token");
    }
  },

  async validateToken(token: string): Promise<{ id: string; email: string; role: string } | null> {
    try {
      const refreshToken = await prisma.refreshToken.findUnique({
        where: { token },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              emailVerified: true,
            },
          },
        },
      });

      if (!refreshToken || refreshToken.expiresAt < new Date()) {
        if (refreshToken) {
          await this.revokeToken(token);
        }
        return null;
      }

      if (!refreshToken.user.emailVerified) {
        await this.revokeToken(token);
        return null;
      }

      return {
        id: refreshToken.user.id,
        email: refreshToken.user.email,
        role: refreshToken.user.role,
      };
    } catch (error) {
      logError(error, `Failed to validate refresh token: ${token}`);
      return null;
    }
  },

  async revokeToken(token: string): Promise<void> {
    try {
      await prisma.refreshToken.delete({
        where: { token },
      });
      logInfo("Refresh token revoked", { token });
    } catch (error) {
      logError(error, `Failed to revoke refresh token: ${token}`);
    }
  },

  async revokeAllUserTokens(userId: string): Promise<void> {
    try {
      const result = await prisma.refreshToken.deleteMany({
        where: { userId },
      });
      logInfo("All user refresh tokens revoked", { 
        userId, 
        revokedCount: result.count 
      });
    } catch (error) {
      logError(error, `Failed to revoke user refresh tokens for user ${userId}`);
    }
  },

  async cleanupExpiredTokens(): Promise<void> {
    try {
      const result = await prisma.refreshToken.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
      logInfo("Expired refresh tokens cleaned up", { 
        cleanedCount: result.count 
      });
    } catch (error) {
      logError(error, "Failed to cleanup expired refresh tokens");
    }
  },

  async getUserTokens(userId: string) {
    try {
      return await prisma.refreshToken.findMany({
        where: { userId },
        select: {
          id: true,
          token: true,
          expiresAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      logError(error, `Failed to get user refresh tokens for user ${userId}`);
      return [];
    }
  },
};
