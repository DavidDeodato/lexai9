import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getAllAssistants, createAssistant } from "@/lib/assistants"

// Obter todos os assistentes
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const assistants = await getAllAssistants()

    return NextResponse.json(assistants)
  } catch (error) {
    console.error("Erro ao buscar assistentes:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao buscar assistentes" }, { status: 500 })
  }
}

// Criar um novo assistente personalizado
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { name, description, icon, category, instructions, model, temperature, documents } = await req.json()

    if (!name || !description || !icon || !category) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos" }, { status: 400 })
    }

    // Criar assistente
    const assistant = await createAssistant({
      name,
      description,
      icon,
      category,
      instructions,
      model,
      temperature,
      documents,
    })

    return NextResponse.json(assistant, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar assistente:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao criar assistente" }, { status: 500 })
  }
}

