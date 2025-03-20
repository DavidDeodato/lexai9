import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      plan: string
      planStatus: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    plan?: string
    planStatus?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    plan?: string
    planStatus?: string
  }
}

