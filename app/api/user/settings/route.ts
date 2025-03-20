import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserSettings, updateUserSettings } from "@/lib/users"

// Obter configurações do usuário
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const settings = await getUserSettings(userId)

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao buscar configurações" }, { status: 500 })
  }
}

// Atualizar configurações do usuário
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const data = await req.json()

    // Atualizar configurações
    const updatedSettings = await updateUserSettings(userId, data)

    // Atualizar a sessão com as novas configurações
    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        settings: updatedSettings,
      },
    }

    return NextResponse.json({
      settings: updatedSettings,
      session: updatedSession,
    })
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar configurações" }, { status: 500 })
  }
}

