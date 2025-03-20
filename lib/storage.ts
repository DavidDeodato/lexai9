import { randomUUID } from "crypto"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

// Diretório para armazenar arquivos
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

// Garantir que o diretório de uploads existe
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    console.error("Erro ao criar diretório de uploads:", error)
  }
}

// Função para salvar um arquivo
export async function saveFile(file: Buffer, fileName: string, subDir = ""): Promise<string> {
  await ensureUploadDir()

  // Criar subdiretório se necessário
  const dirPath = subDir ? path.join(UPLOAD_DIR, subDir) : UPLOAD_DIR
  await mkdir(dirPath, { recursive: true })

  // Gerar nome único para o arquivo
  const fileExt = path.extname(fileName)
  const uniqueFileName = `${randomUUID()}${fileExt}`
  const filePath = path.join(dirPath, uniqueFileName)

  // Salvar o arquivo
  await writeFile(filePath, file)

  // Retornar URL relativa para o arquivo
  const relativePath = path.join("/uploads", subDir, uniqueFileName)
  return relativePath.replace(/\\/g, "/")
}

// Função para validar tipo de arquivo
export function validateFileType(fileName: string, allowedTypes: string[]): boolean {
  const fileExt = path.extname(fileName).toLowerCase()
  return allowedTypes.includes(fileExt)
}

// Função para validar tamanho de arquivo (em bytes)
export function validateFileSize(fileSize: number, maxSize: number): boolean {
  return fileSize <= maxSize
}

