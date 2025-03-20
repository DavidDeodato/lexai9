import { PrismaClient } from "@prisma/client"

async function main() {
  const prisma = new PrismaClient()

  try {
    console.log("Tentando conectar ao banco de dados...")

    // Tenta uma operação simples para verificar a conexão
    const count = await prisma.user.count()

    console.log("Conexão bem-sucedida!")
    console.log(`Número de usuários no banco: ${count}`)

    // Verifica as tabelas existentes
    console.log("\nVerificando tabelas...")
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log("Tabelas encontradas:", tables)
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

