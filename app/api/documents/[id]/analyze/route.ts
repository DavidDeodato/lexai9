import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { analyzeDocument } from "@/lib/openai"

// Analisar um documento
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const documentId = Number.parseInt(params.id)
    const { query } = await req.json()

    // Verificar se o documento pertence ao usuário
    const document = await prisma.document_lex.findFirst({
      where: {
        id: documentId,
        user_id: userId,
      },
    })

    if (!document) {
      return NextResponse.json({ error: "Documento não encontrado ou não pertence ao usuário" }, { status: 404 })
    }

    if (!document.content) {
      return NextResponse.json({ error: "Documento não possui conteúdo para análise" }, { status: 400 })
    }

    // Analisar documento
    const analysis = await analyzeDocument(document.content, query)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Erro ao analisar documento:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao analisar documento" }, { status: 500 })
  }
}

