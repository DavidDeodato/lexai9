import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getAssistant, updateAssistant, deleteAssistant } from "@/lib/assistants"

// Obter um assistente específico
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const assistantId = params.id
    const assistant = await getAssistant(assistantId)

    return NextResponse.json(assistant)
  } catch (error) {
    console.error("Erro ao buscar assistente:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao buscar assistente" }, { status: 500 })
  }
}

// Atualizar um assistente personalizado
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const assistantId = params.id
    const { name, description, icon, category, instructions, model, temperature, documents } = await req.json()

    // Atualizar assistente
    const assistant = await updateAssistant(assistantId, {
      name,
      description,
      icon,
      category,
      instructions,
      model,
      temperature,
      documents,
    })

    return NextResponse.json(assistant)
  } catch (error) {
    console.error("Erro ao atualizar assistente:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar assistente" }, { status: 500 })
  }
}

// Excluir um assistente personalizado
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const assistantId = params.id
    await deleteAssistant(assistantId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir assistente:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao excluir assistente" }, { status: 500 })
  }
}

