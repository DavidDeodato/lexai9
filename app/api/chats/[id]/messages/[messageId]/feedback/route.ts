import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { giveMessageFeedback } from "@/lib/chats"

// Dar feedback a uma mensagem
export async function POST(req: Request, { params }: { params: { id: string; messageId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const messageId = Number.parseInt(params.messageId)
    const { feedback } = await req.json()

    if (!feedback || !["positive", "negative"].includes(feedback)) {
      return NextResponse.json({ error: "Feedback inválido" }, { status: 400 })
    }

    // Dar feedback
    const result = await giveMessageFeedback(messageId, userId, feedback as "positive" | "negative")

    return NextResponse.json(result)
  } catch (error) {
    console.error("Erro ao dar feedback:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao dar feedback" }, { status: 500 })
  }
}

