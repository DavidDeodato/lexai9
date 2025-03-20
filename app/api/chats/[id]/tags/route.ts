import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { manageChatTags } from "@/lib/chats"

// Gerenciar tags de um chat
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const chatId = Number.parseInt(params.id)
    const { tags } = await req.json()

    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: "Tags inválidas" }, { status: 400 })
    }

    // Gerenciar tags
    const result = await manageChatTags(chatId, userId, tags)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao gerenciar tags:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao gerenciar tags" }, { status: 500 })
  }
}

