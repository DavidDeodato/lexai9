import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Criar usuário de demonstração
  const hashedPassword = await bcrypt.hash("demo123", 10)

  const user = await prisma.user.upsert({
    where: { email: "advogado@exemplo.com" },
    update: {},
    create: {
      email: "advogado@exemplo.com",
      name: "Advogado Demo",
      password: hashedPassword,
      subscription: {
        create: {
          plan: "pro",
          status: "active",
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
        },
      },
    },
  })

  // Criar assistentes pré-definidos
  const assistenteDiretoConsumidor = await prisma.assistant.upsert({
    where: { id: "consumidor-default" },
    update: {},
    create: {
      id: "consumidor-default",
      name: "Especialista em Direito do Consumidor",
      description: "Assistente especializado em questões de direito do consumidor",
      instructions:
        "Você é um assistente especializado em direito do consumidor brasileiro. Ajude com dúvidas sobre o CDC, relações de consumo, direitos do consumidor e casos práticos nesta área.",
      type: "consumidor",
      userId: user.id,
    },
  })

  const assistenteDireitoTrabalho = await prisma.assistant.upsert({
    where: { id: "trabalhista-default" },
    update: {},
    create: {
      id: "trabalhista-default",
      name: "Especialista em Direito Trabalhista",
      description: "Assistente especializado em questões trabalhistas",
      instructions:
        "Você é um assistente especializado em direito trabalhista brasileiro. Ajude com dúvidas sobre CLT, direitos trabalhistas, processos trabalhistas e casos práticos nesta área.",
      type: "trabalhista",
      userId: user.id,
    },
  })

  console.log({ user, assistenteDiretoConsumidor, assistenteDireitoTrabalho })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

