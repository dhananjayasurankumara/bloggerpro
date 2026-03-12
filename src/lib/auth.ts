import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) {
            console.error(`[AUTH] User not found or no password: ${credentials.email}`);
            throw new Error("Invalid credentials");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            console.error(`[AUTH] Password mismatch for: ${credentials.email}`);
            throw new Error("Invalid credentials");
          }

          return user;
        } catch (error: any) {
          console.error("[AUTH] Authorization logic failure:", {
            message: error.message,
            stack: error.stack,
            credentials: { email: credentials?.email }
          });
          throw new Error(error.message || "Internal server error during auth");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, metadata) {
      console.error(`[NEXTAUTH_ERROR] ${code}`, metadata);
    },
    warn(code) {
      console.warn(`[NEXTAUTH_WARN] ${code}`);
    },
    debug(code, metadata) {
      console.log(`[NEXTAUTH_DEBUG] ${code}`, metadata);
    },
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      console.log("[AUTH] Session callback triggered", { sub: token?.sub });
      if (session.user && token.sub) {
        // Verify user still exists in DB and select all required fields
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { 
            id: true, 
            role: true, 
            bio: true,
            notifNetwork: true,
            notifDirect: true,
            notifMarket: true,
            notifTransaction: true,
            prefDarkMode: true,
            prefLowNoise: true
          }
        });

        if (!dbUser || dbUser.role === "BANNED") {
          return null as any;
        }

        (session.user as any).id = dbUser.id;
        (session.user as any).role = dbUser.role;
        (session.user as any).bio = dbUser.bio;
        (session.user as any).notifNetwork = dbUser.notifNetwork;
        (session.user as any).notifDirect = dbUser.notifDirect;
        (session.user as any).notifMarket = dbUser.notifMarket;
        (session.user as any).notifTransaction = dbUser.notifTransaction;
        (session.user as any).prefDarkMode = dbUser.prefDarkMode;
        (session.user as any).prefLowNoise = dbUser.prefLowNoise;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.bio = (user as any).bio;
      }
      // Handle the "update" trigger from useSession
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.bio = session.bio || token.bio;
      }
      return token;
    },
  },
};
