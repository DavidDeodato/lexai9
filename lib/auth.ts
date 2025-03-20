import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import prisma from "./prisma"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user_lex.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            settings: true,
            subscription: true,
          },
        })

        if (!user) {
          console.log("Usuário não encontrado:", credentials.email)
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password_hash)

        if (!isPasswordValid) {
          console.log("Senha inválida para usuário:", credentials.email)
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username,
          fullName: user.full_name || null,
          profileImage: user.profile_image_url || null,
          settings: user.settings || null,
          plan: user.subscription?.plan_type || "free",
          planStatus: user.subscription?.status || "inactive",
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          fullName: token.fullName,
          profileImage: token.profileImage,
          settings: token.settings,
          plan: token.plan,
          planStatus: token.planStatus,
        },
      }
    },
    jwt: ({ token, user, trigger, session }) => {
      // Atualizar o token quando o usuário faz login
      if (user) {
        return {
          ...token,
          id: user.id,
          fullName: user.fullName,
          profileImage: user.profileImage,
          settings: user.settings,
          plan: user.plan,
          planStatus: user.planStatus,
        }
      }

      // Atualizar o token quando a sessão é atualizada
      if (trigger === "update" && session) {
        return {
          ...token,
          ...session.user,
        }
      }

      return token
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
}

