import { Session, User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { userService } from "@/services/userService";
import { refreshTokenService } from "@/services/refreshTokenService";
import { AppRole } from "@/types/appRole";
import { JWT } from "next-auth/jwt";
import { getEnvVar } from "@/lib/getEnvVar";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnvVar("GOOGLE_CLIENT_ID"),
      clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const user = await userService.getByEmail(credentials.email);
        if (!user) throw new Error("Invalid credentials");

        if (!user.passwordHash) {
          throw new Error("This account was created with Google login. Please use Google to sign in.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) throw new Error("Invalid credentials");

        if (!user.emailVerified) {
          throw new Error("Please verify your email address before logging in.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role as AppRole,
          rememberMe: credentials.rememberMe === "true"
        } as User;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    signOut: "/login",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      const now = Math.floor(Date.now() / 1000);
    
      if (user) {
        try {
          if (account?.provider === "google" && profile) {
            const googleProfile = profile as GoogleProfile;
            const dbUser = await userService.upsertGoogleUser({
              email: googleProfile.email,
              name: googleProfile.name,
              picture: googleProfile.picture,
            });
    
            token = {
              ...token,
              id: dbUser.id,
              role: dbUser.role as AppRole,
              email: dbUser.email,
              name: dbUser.name,
              rememberMe: true,
            };
          } else {
            token = {
              ...token,
              id: (user as User).id,
              role: (user as User).role,
              rememberMe: (user as User).rememberMe ?? false,
            };
          }
    
          token.refreshToken = await refreshTokenService.createToken(
            token.id as string,
            token.rememberMe
          );
          token.accessTokenExpires = now + 60 * 15;
        } catch (error) {
          console.error("JWT initialization failed:", error);
          return token;
        }
      }
    
      if (token.refreshToken && token.accessTokenExpires && now >= token.accessTokenExpires) {
        try {
          const userData = await refreshTokenService.validateToken(token.refreshToken);
    
          if (userData) {
            token = {
              ...token,
              id: userData.id,
              email: userData.email,
              role: userData.role as AppRole,
              accessTokenExpires: now + 60 * 15,
            };
          } else {
            token.refreshToken = undefined;
            token.accessTokenExpires = undefined;
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          token.refreshToken = undefined;
          token.accessTokenExpires = undefined;
        }
      }
    
      return token;
    },    

    async session({ session, token }: { session: Session; token: JWT }) {
      if (!token.accessTokenExpires || !token.id) {
        return {
          ...session,
          expires: new Date(0).toISOString(),
        };
      }

      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as AppRole,
      };
      session.rememberMe = token.rememberMe ?? false;

      if (token.accessTokenExpires) {
        session.accessTokenExpires = new Date(token.accessTokenExpires * 1000).toISOString();
      }
      console.log("token.rememberMe: ", token.rememberMe);
      console.log("session.accessTokenExpires: ", session.accessTokenExpires);

      return session;
    },
  },
};
