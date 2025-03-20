import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { initializeDefaultAssistants } from "../lib/assistants"

const prisma = new PrismaClient()

async function main() {
  console.log("Inicializando banco de dados...")

  // Inicializar assistentes padrão
  await initializeDefaultAssistants()

  // Criar usuário de demonstração
  const demoUserEmail = "demo@lexia.com"
  const existingUser = await prisma.user_lex.findUnique({
    where: { email: demoUserEmail },
  })

  if (!existingUser) {
    const hashedPassword = await hash("demo123", 10)

    const user = await prisma.user_lex.create({
      data: {
        username: "advogado_demo",
        email: demoUserEmail,
        password_hash: hashedPassword,
        full_name: "Advogado Demo",
        company: "Escritório de Advocacia Demo",
        phone: "(11) 98765-4321",
        location: "São Paulo, SP",
        bio: "Advogado especializado em direito penal e civil com mais de 10 anos de experiência. Atuo principalmente em casos complexos que exigem estratégias inovadoras.",
      },
    })

    // Criar configurações para o usuário
    await prisma.userSettings_lex.create({
      data: {
        user_id: user.id,
        theme: "dark",
        email_notifications: true,
        browser_notifications: true,
        update_notifications: true,
        data_retention: true,
        two_factor_auth: false,
        session_timeout: true,
        default_model: "gpt-4o",
        temperature: 0.7,
        context_window: true,
        tools_enabled: true,
      },
    })

    console.log("Usuário de demonstração criado com sucesso!")
  } else {
    console.log("Usuário de demonstração já existe.")
  }

  console.log("Banco de dados inicializado com sucesso!")
}

main()
  .catch((e) => {
    console.error("Erro ao inicializar banco de dados:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

