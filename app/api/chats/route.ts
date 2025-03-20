import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserChats, createChat } from "@/lib/chats"

// Obter todos os chats do usuário
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const chats = await getUserChats(userId)

    return NextResponse.json(chats)
  } catch (error) {
    console.error("Erro ao buscar chats:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao buscar chats" }, { status: 500 })
  }
}

// Criar um novo chat
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { title, assistantId, tags } = await req.json()
    const userId = Number.parseInt(session.user.id as string)

    if (!title || !assistantId) {
      return NextResponse.json({ error: "Título e ID do assistente são obrigatórios" }, { status: 400 })
    }

    // Criar chat
    const chat = await createChat(userId, title, assistantId, tags)

    return NextResponse.json(chat, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar chat:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao criar chat" }, { status: 500 })
  }
}

