import { readFile } from "fs/promises"
import path from "path"
import prisma from "./prisma"
import { extractTextFromDocument } from "./openai"

// Função para processar documento após upload
export async function processDocument(
  userId: number,
  filePath: string,
  fileName: string,
  fileType: string,
  fileSize: number,
) {
  try {
    // Criar registro do documento no banco de dados
    const document = await prisma.document_lex.create({
      data: {
        user_id: userId,
        name: fileName,
        file_type: fileType,
        file_size: fileSize,
        file_url: filePath,
      },
    })

    // Para documentos de texto, extrair conteúdo
    if (["pdf", "docx", "txt", "doc"].includes(fileType.toLowerCase())) {
      // Ler o arquivo
      const fullPath = path.join(process.cwd(), "public", filePath.replace(/^\//, ""))
      const fileBuffer = await readFile(fullPath)

      // Extrair texto (implementação simplificada)
      // Em um cenário real, você usaria bibliotecas específicas para cada tipo de arquivo
      let textContent = ""

      if (fileType.toLowerCase() === "txt") {
        textContent = fileBuffer.toString("utf-8")
      } else {
        // Para outros tipos de arquivo, usar OpenAI para extrair texto
        // Isso é uma simplificação - em produção, use bibliotecas específicas
        textContent = await extractTextFromDocument(fileBuffer.toString("base64"))
      }

      // Atualizar documento com o conteúdo extraído
      await prisma.document_lex.update({
        where: { id: document.id },
        data: { content: textContent },
      })
    }

    return document
  } catch (error) {
    console.error("Erro ao processar documento:", error)
    throw new Error("Falha ao processar o documento. Por favor, tente novamente.")
  }
}

// Função para associar documento a um assistente
export async function associateDocumentWithAssistant(documentId: number, assistantId: string) {
  try {
    // Verificar se a associação já existe
    const existingAssociation = await prisma.assistantDocument_lex.findFirst({
      where: {
        document_id: documentId,
        assistant_id: assistantId,
      },
    })

    if (existingAssociation) {
      return existingAssociation
    }

    // Criar nova associação
    return await prisma.assistantDocument_lex.create({
      data: {
        document_id: documentId,
        assistant_id: assistantId,
      },
    })
  } catch (error) {
    console.error("Erro ao associar documento com assistente:", error)
    throw new Error("Falha ao associar documento com assistente. Por favor, tente novamente.")
  }
}

// Função para associar documento a uma mensagem
export async function associateDocumentWithMessage(documentId: number, messageId: number) {
  try {
    // Verificar se a associação já existe
    const existingAssociation = await prisma.messageDocument_lex.findFirst({
      where: {
        document_id: documentId,
        message_id: messageId,
      },
    })

    if (existingAssociation) {
      return existingAssociation
    }

    // Criar nova associação
    return await prisma.messageDocument_lex.create({
      data: {
        document_id: documentId,
        message_id: messageId,
      },
    })
  } catch (error) {
    console.error("Erro ao associar documento com mensagem:", error)
    throw new Error("Falha ao associar documento com mensagem. Por favor, tente novamente.")
  }
}

// Função para obter documentos de um usuário
export async function getUserDocuments(userId: number) {
  try {
    return await prisma.document_lex.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    })
  } catch (error) {
    console.error("Erro ao obter documentos do usuário:", error)
    throw new Error("Falha ao obter documentos. Por favor, tente novamente.")
  }
}

// Função para excluir um documento
export async function deleteDocument(documentId: number, userId: number) {
  try {
    // Verificar se o documento pertence ao usuário
    const document = await prisma.document_lex.findFirst({
      where: {
        id: documentId,
        user_id: userId,
      },
    })

    if (!document) {
      throw new Error("Documento não encontrado ou não pertence ao usuário.")
    }

    // Excluir o documento
    await prisma.document_lex.delete({
      where: { id: documentId },
    })

    return true
  } catch (error) {
    console.error("Erro ao excluir documento:", error)
    throw new Error("Falha ao excluir documento. Por favor, tente novamente.")
  }
}

