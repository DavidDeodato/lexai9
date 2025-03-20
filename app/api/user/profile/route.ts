import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserProfile, updateUserProfile } from "@/lib/users"

// Obter perfil do usuário
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const user = await getUserProfile(userId)

    return NextResponse.json(user)
  } catch (error) {
    console.error("Erro ao buscar perfil:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao buscar perfil" }, { status: 500 })
  }
}

// Atualizar perfil do usuário
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id as string)
    const { username, email, full_name, company, phone, location, bio, current_password, new_password } =
      await req.json()

    // Atualizar perfil
    const updatedUser = await updateUserProfile(userId, {
      username,
      email,
      full_name,
      company,
      phone,
      location,
      bio,
      current_password,
      new_password,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 })
  }
}

