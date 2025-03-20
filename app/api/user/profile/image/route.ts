import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { updateProfileImage } from "@/lib/users"

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

    // Converter o arquivo para Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Atualizar foto de perfil
    const result = await updateProfileImage(userId, buffer, file.name)

    // Atualizar a sessão com a nova URL da imagem
    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        profileImage: result.profile_image_url,
      },
    }

    return NextResponse.json({
      success: true,
      profileImageUrl: result.profile_image_url,
      session: updatedSession,
    })
  } catch (error) {
    console.error("Erro ao atualizar foto de perfil:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: "Erro ao atualizar foto de perfil" }, { status: 500 })
  }
}

