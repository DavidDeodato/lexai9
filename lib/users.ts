import { hash, compare } from "bcrypt"
import prisma from "./prisma"
import { saveFile, validateFileType, validateFileSize } from "./storage"

// Função para criar um novo usuário
export async function createUser(data: {
  username: string
  email: string
  password: string
  full_name?: string
  company?: string
}) {
  try {
    // Verificar se o email já está em uso
    const existingUserByEmail = await prisma.user_lex.findUnique({
      where: { email: data.email },
    })

    if (existingUserByEmail) {
      throw new Error("Email já está em uso.")
    }

    // Verificar se o username já está em uso
    const existingUserByUsername = await prisma.user_lex.findUnique({
      where: { username: data.username },
    })

    if (existingUserByUsername) {
      throw new Error("Nome de usuário já está em uso.")
    }

    // Hash da senha
    const hashedPassword = await hash(data.password, 10)

    // Criar usuário
    const user = await prisma.user_lex.create({
      data: {
        username: data.username,
        email: data.email,
        password_hash: hashedPassword,
        full_name: data.full_name,
        company: data.company,
      },
    })

    // Criar configurações padrão para o usuário
    await prisma.userSettings_lex.create({
      data: {
        user_id: user.id,
      },
    })

    // Retornar usuário sem a senha
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      company: user.company,
    }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Falha ao criar usuário. Por favor, tente novamente.")
  }
}

// Função para obter perfil do usuário
export async function getUserProfile(userId: number) {
  try {
    const user = await prisma.user_lex.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        company: true,
        phone: true,
        location: true,
        bio: true,
        profile_image_url: true,
        settings: true,
      },
    })

    if (!user) {
      throw new Error("Usuário não encontrado.")
    }

    return user
  } catch (error) {
    console.error("Erro ao obter perfil do usuário:", error)
    throw new Error("Falha ao obter perfil do usuário. Por favor, tente novamente.")
  }
}

// Função para atualizar perfil do usuário
export async function updateUserProfile(
  userId: number,
  data: {
    username?: string
    email?: string
    full_name?: string
    company?: string
    phone?: string
    location?: string
    bio?: string
    current_password?: string
    new_password?: string
  },
) {
  try {
    // Verificar se o usuário existe
    const user = await prisma.user_lex.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error("Usuário não encontrado.")
    }

    // Preparar dados para atualização
    const updateData: any = {}

    // Atualizar username se fornecido
    if (data.username && data.username !== user.username) {
      // Verificar se o username já está em uso
      const existingUser = await prisma.user_lex.findFirst({
        where: {
          username: data.username,
          NOT: {
            id: userId,
          },
        },
      })

      if (existingUser) {
        throw new Error("Nome de usuário já está em uso.")
      }

      updateData.username = data.username
    }

    // Atualizar email se fornecido
    if (data.email && data.email !== user.email) {
      // Verificar se o email já está em uso
      const existingUser = await prisma.user_lex.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: userId,
          },
        },
      })

      if (existingUser) {
        throw new Error("Email já está em uso.")
      }

      updateData.email = data.email
    }

    // Atualizar outros campos
    if (data.full_name !== undefined) updateData.full_name = data.full_name
    if (data.company !== undefined) updateData.company = data.company
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.location !== undefined) updateData.location = data.location
    if (data.bio !== undefined) updateData.bio = data.bio

    // Atualizar senha se fornecida
    if (data.current_password && data.new_password) {
      // Verificar senha atual
      const isPasswordValid = await compare(data.current_password, user.password_hash)

      if (!isPasswordValid) {
        throw new Error("Senha atual incorreta.")
      }

      // Hash da nova senha
      updateData.password_hash = await hash(data.new_password, 10)
    }

    // Atualizar usuário
    const updatedUser = await prisma.user_lex.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        company: true,
        phone: true,
        location: true,
        bio: true,
        profile_image_url: true,
      },
    })

    return updatedUser
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Falha ao atualizar perfil do usuário. Por favor, tente novamente.")
  }
}

// Função para atualizar foto de perfil
export async function updateProfileImage(userId: number, file: Buffer, fileName: string) {
  try {
    // Verificar se o usuário existe
    const user = await prisma.user_lex.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error("Usuário não encontrado.")
    }

    // Validar tipo de arquivo
    if (!validateFileType(fileName, [".jpg", ".jpeg", ".png", ".gif"])) {
      throw new Error("Tipo de arquivo não suportado. Use JPG, PNG ou GIF.")
    }

    // Validar tamanho do arquivo (5MB)
    if (!validateFileSize(file.length, 5 * 1024 * 1024)) {
      throw new Error("Arquivo muito grande. Tamanho máximo: 5MB.")
    }

    // Salvar arquivo
    const filePath = await saveFile(file, fileName, "profile-images")

    // Atualizar usuário
    const updatedUser = await prisma.user_lex.update({
      where: { id: userId },
      data: {
        profile_image_url: filePath,
      },
      select: {
        id: true,
        profile_image_url: true,
      },
    })

    return updatedUser
  } catch (error) {
    console.error("Erro ao atualizar foto de perfil:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Falha ao atualizar foto de perfil. Por favor, tente novamente.")
  }
}

// Função para obter configurações do usuário
export async function getUserSettings(userId: number) {
  try {
    const settings = await prisma.userSettings_lex.findUnique({
      where: { user_id: userId },
    })

    if (!settings) {
      // Criar configurações padrão se não existirem
      return await prisma.userSettings_lex.create({
        data: {
          user_id: userId,
        },
      })
    }

    return settings
  } catch (error) {
    console.error("Erro ao obter configurações do usuário:", error)
    throw new Error("Falha ao obter configurações do usuário. Por favor, tente novamente.")
  }
}

// Função para atualizar configurações do usuário
export async function updateUserSettings(
  userId: number,
  data: {
    theme?: string
    email_notifications?: boolean
    browser_notifications?: boolean
    update_notifications?: boolean
    data_retention?: boolean
    two_factor_auth?: boolean
    session_timeout?: boolean
    default_model?: string
    temperature?: number
    context_window?: boolean
    tools_enabled?: boolean
  },
) {
  try {
    // Verificar se o usuário existe
    const user = await prisma.user_lex.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new Error("Usuário não encontrado.")
    }

    // Verificar se as configurações existem
    const existingSettings = await prisma.userSettings_lex.findUnique({
      where: { user_id: userId },
    })

    if (!existingSettings) {
      // Criar configurações com os dados fornecidos
      return await prisma.userSettings_lex.create({
        data: {
          user_id: userId,
          ...data,
        },
      })
    }

    // Atualizar configurações
    return await prisma.userSettings_lex.update({
      where: { user_id: userId },
      data,
    })
  } catch (error) {
    console.error("Erro ao atualizar configurações do usuário:", error)
    throw new Error("Falha ao atualizar configurações do usuário. Por favor, tente novamente.")
  }
}

// Função para obter estatísticas do usuário
export async function getUserStats(userId: number) {
  try {
    // Contar total de chats
    const totalChats = await prisma.chat_lex.count({
      where: { user_id: userId },
    })

    // Contar total de mensagens
    const totalMessages = await prisma.message_lex.count({
      where: {
        chat: {
          user_id: userId,
        },
      },
    })

    // Contar total de documentos
    const totalDocuments = await prisma.document_lex.count({
      where: { user_id: userId },
    })

    // Calcular tempo economizado (estimativa)
    // Assumindo que cada mensagem economiza 5 minutos
    const timesSaved = totalMessages * 5

    // Obter uso de assistentes
    const assistantUsage = await prisma.assistantUsage_lex.findMany({
      where: { user_id: userId },
      include: {
        assistant: true,
      },
      orderBy: {
        tokens_used: "desc",
      },
    })

    return {
      totalChats,
      totalMessages,
      totalDocuments,
      timesSaved,
      assistantUsage,
    }
  } catch (error) {
    console.error("Erro ao obter estatísticas do usuário:", error)
    throw new Error("Falha ao obter estatísticas do usuário. Por favor, tente novamente.")
  }
}

