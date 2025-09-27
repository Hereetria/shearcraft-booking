import { Role } from "@prisma/client";

export type AuthConfig = {
    required: boolean;
    roles: Role[];
  };