import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const chatId = Number.parseInt(params.id)

    // Verificar se o chat pertence ao usuário
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: session.user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat não encontrado ou acesso negado" }, { status: 404 })
    }

    return NextResponse.json({ messages: chat.messages })
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error)
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const chatId = Number.parseInt(params.id)
    const { content, role } = await request.json()

    // Verificar se o chat pertence ao usuário
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId: session.user.id,
      },
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat não encontrado ou acesso negado" }, { status: 404 })
    }

    // Verificar se o usuário tem acesso ao tipo de assistente
    if (chat.assistantType !== "general") {
      const userPlan = (session.user as any).plan || "free"
      const hasAccess = userPlan === "pro" || userPlan === "enterprise"

      if (!hasAccess) {
        return NextResponse.json({ error: "Este assistente requer um plano Pro ou Enterprise" }, { status: 403 })
      }
    }

    // Criar a mensagem
    const message = await prisma.message.create({
      data: {
        content,
        role,
        chatId,
      },
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Erro ao criar mensagem:", error)
    return NextResponse.json({ error: "Erro ao criar mensagem" }, { status: 500 })
  }
}

