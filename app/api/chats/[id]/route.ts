import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getChat, updateChatTitle, toggleChatFavorite, deleteChat } from "@/lib/chats"

// Obter um chat específico com todas as mensagens
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const chatId = Number.parseInt(params.id)

    const chat = await getChat(chatId, userId)

    return NextResponse.json(chat)
  } catch (error) {
    console.error("Erro ao buscar chat:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao buscar chat" }, { status: 500 })
  }
}

// Atualizar título do chat
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const chatId = Number.parseInt(params.id)
    const { title, toggleFavorite } = await req.json()

    if (toggleFavorite) {
      // Alternar status de favorito
      const chat = await toggleChatFavorite(chatId, userId)
      return NextResponse.json(chat)
    } else if (title) {
      // Atualizar título
      const chat = await updateChatTitle(chatId, userId, title)
      return NextResponse.json(chat)
    } else {
      return NextResponse.json({ error: "Nenhuma ação especificada" }, { status: 400 })
    }
  } catch (error) {
    console.error("Erro ao atualizar chat:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar chat" }, { status: 500 })
  }
}

// Excluir chat
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const chatId = Number.parseInt(params.id)

    await deleteChat(chatId, userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir chat:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao excluir chat" }, { status: 500 })
  }
}

