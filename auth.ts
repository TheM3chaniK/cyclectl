import NextAuth, { type NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import type { DefaultSession, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"
import clientPromise from "@/lib/mongo"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user?.email) return false

      const client = await clientPromise
      const db = client.db("cyclectl")

      await db.collection("users").updateOne(
        { email: user.email },
        { $set: user },
        { upsert: true }
      )

      const mongoUser = await db.collection("users").findOne({ email: user.email })
      if (mongoUser) user.id = mongoUser._id.toString()

      return true
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user?.id) token.id = user.id
      return token
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
}

export default NextAuth(authOptions)

