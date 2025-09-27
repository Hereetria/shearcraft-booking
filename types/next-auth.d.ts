import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      emailVerified: boolean;
    } & DefaultSession["user"];
    rememberMe?: boolean;
    accessTokenExpires: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    emailVerified: boolean;
    rememberMe?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    role: Role;
    emailVerified: boolean;
    rememberMe?: boolean;
    accessTokenExpires?: number;
    refreshToken?: string;
  }
}
