import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma";


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, email, password } = body

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email já está em uso" }, { status: 400 })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar o usuário
    const user = await prisma.user.create({
      data: {
        name: username,
        email: email,
        password: hashedPassword,
      },
    })

    // Criar assinatura separadamente para evitar problemas
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: "free",
        status: "active",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      },
    })

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error)
    return NextResponse.json({ error: `Erro ao criar usuário: ${error.message}` }, { status: 500 })
  }
}

