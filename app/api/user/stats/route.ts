import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserStats } from "@/lib/users"

// Obter estatísticas do usuário
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const stats = await getUserStats(userId)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}

