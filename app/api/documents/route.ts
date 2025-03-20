import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserDocuments } from "@/lib/documents"
import { saveFile, validateFileType, validateFileSize } from "@/lib/storage"
import { processDocument } from "@/lib/documents"

// Obter todos os documentos do usuário
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const documents = await getUserDocuments(userId)

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Erro ao buscar documentos:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao buscar documentos" }, { status: 500 })
  }
}

// Fazer upload de um documento
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)

    // Processar o upload do arquivo
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Validar tipo de arquivo
    const allowedTypes = [".pdf", ".docx", ".doc", ".txt", ".rtf", ".md", ".csv", ".json"]
    if (!validateFileType(file.name, allowedTypes)) {
      return NextResponse.json(
        {
          error: `Tipo de arquivo não suportado. Tipos permitidos: ${allowedTypes.join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Validar tamanho do arquivo (10MB)
    if (!validateFileSize(file.size, 10 * 1024 * 1024)) {
      return NextResponse.json({ error: "Arquivo muito grande. Tamanho máximo: 10MB." }, { status: 400 })
    }

    // Converter o arquivo para Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Salvar arquivo
    const filePath = await saveFile(buffer, file.name, "documents")

    // Processar documento
    const document = await processDocument(userId, filePath, file.name, file.name.split(".").pop() || "", file.size)

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Erro ao fazer upload de documento:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao fazer upload de documento" }, { status: 500 })
  }
}

