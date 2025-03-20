import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { deleteDocument } from "@/lib/documents"

// Excluir um documento
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const documentId = Number.parseInt(params.id)

    await deleteDocument(documentId, userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir documento:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao excluir documento" }, { status: 500 })
  }
}

