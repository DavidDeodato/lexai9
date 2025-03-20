import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma";


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas")
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (!user || !user.password) {
            throw new Error("Usuário não encontrado")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error("Senha incorreta")
          }

          // Buscar assinatura separadamente
          const subscription = await prisma.subscription.findUnique({
            where: {
              userId: user.id,
            },
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            plan: subscription?.plan || "free",
            planStatus: subscription?.status || "inactive",
          }
        } catch (error) {
          console.error("Erro na autenticação:", error)
          throw new Error("Erro na autenticação")
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.plan = user.plan
        token.planStatus = user.planStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
        session.user.plan = token.plan as string
        session.user.planStatus = token.planStatus as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }

