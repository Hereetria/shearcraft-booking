import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    role: Role;
  }
}