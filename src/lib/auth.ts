import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid password");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Verify user still exists in DB
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { id: true, role: true, bio: true }
        });

        if (!dbUser || dbUser.role === "BANNED") {
          // If user doesn't exist or is banned, invalidate the session
          return null as any;
        }

        (session.user as any).id = dbUser.id;
        (session.user as any).role = dbUser.role;
        (session.user as any).bio = dbUser.bio;
        (session.user as any).notifNetwork = (dbUser as any).notifNetwork;
        (session.user as any).notifDirect = (dbUser as any).notifDirect;
        (session.user as any).notifMarket = (dbUser as any).notifMarket;
        (session.user as any).notifTransaction = (dbUser as any).notifTransaction;
        (session.user as any).prefDarkMode = (dbUser as any).prefDarkMode;
        (session.user as any).prefLowNoise = (dbUser as any).prefLowNoise;
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
