export interface Session {
  user?: {
    role?: string;
  };
}

export type SessionData = Session | null;
